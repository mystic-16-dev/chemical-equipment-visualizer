from django.urls import path
print("LOADING CORE URLS")

from .views import (
    RegisterView, LoginView, 
    UploadCSVView, UploadHistoryView, DatasetSummaryView,
    DatasetReportView, DatasetDataView
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Data
    path('upload/', UploadCSVView.as_view(), name='upload-csv'),
    path('history/', UploadHistoryView.as_view(), name='upload-history'),
    path('summary/<int:pk>/', DatasetSummaryView.as_view(), name='dataset-summary'),
    path('data/<int:pk>/', DatasetDataView.as_view(), name='dataset-data'),
    path('report/<int:pk>/', DatasetReportView.as_view(), name='dataset-report'),
]
