from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .models import UploadedDataset
from .serializers import UserSerializer, UploadedDatasetSerializer
from django.http import HttpResponse
from .utils import process_csv_analytics, generate_pdf_report

# ... (Previous imports)

class DatasetReportView(APIView):
    """
    Generate and download PDF report.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        dataset = get_object_or_404(UploadedDataset, pk=pk, user=request.user)
        pdf_buffer = generate_pdf_report(dataset)
        
        filename = f"report_{dataset.id}.pdf"
        response = HttpResponse(pdf_buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        else:
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)

# --- Data Handling ---

class UploadCSVView(generics.CreateAPIView):
    """
    Upload CSV, run analytics, and save summary.
    """
    serializer_class = UploadedDatasetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # 1. Save the file first
        dataset = serializer.save(user=self.request.user)
        
        # 2. Process Analytics
        summary = process_csv_analytics(dataset.file.path)
        
        # 3. Update model with summary
        if "error" in summary:
            # If analytics fail, we might want to delete the file or keep it with error
            dataset.summary_data = summary
            dataset.save()
            # Alternatively raise error, but let's keep it to show user the issue
        else:
            dataset.summary_data = summary
            dataset.save()
            
        # 4. Enforce "Last 5" Rule
        # Get all datasets for this user, ordered by upload_timestamp desc
        user_datasets = UploadedDataset.objects.filter(user=self.request.user).order_by('-upload_timestamp')
        if user_datasets.count() > 5:
            # Delete the oldest ones
            # Slicing from 5 to end gives the ones to delete
            datasets_to_delete = user_datasets[5:]
            for d in datasets_to_delete:
                d.delete()

class UploadHistoryView(generics.ListAPIView):
    """
    Get last 5 uploads for the authenticated user.
    """
    serializer_class = UploadedDatasetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Explicitly order by latest first and limit to 5
        return UploadedDataset.objects.filter(user=self.request.user).order_by('-upload_timestamp')[:5]

class DatasetSummaryView(generics.RetrieveAPIView):
    """
    Get specific dataset details including summary.
    """
    serializer_class = UploadedDatasetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
    def get_queryset(self):
        return UploadedDataset.objects.filter(user=self.request.user)

class DatasetDataView(APIView):
    """
    Get full dataset content as JSON.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        dataset = get_object_or_404(UploadedDataset, pk=pk, user=request.user)
        try:
            import pandas as pd
            df = pd.read_csv(dataset.file.path)
            # Replace NaNs with None for valid JSON
            df = df.where(pd.notnull(df), None)
            return Response(df.to_dict(orient='records'))
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

