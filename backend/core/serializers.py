from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UploadedDataset

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UploadedDatasetSerializer(serializers.ModelSerializer):
    file_path = serializers.SerializerMethodField()

    class Meta:
        model = UploadedDataset
        fields = ['id', 'user', 'dataset_name', 'file', 'upload_timestamp', 'summary_data', 'file_path']
        read_only_fields = ['user', 'upload_timestamp', 'summary_data', 'file_path']

    def validate_file(self, value):
        if not value.name.endswith('.csv'):
            raise serializers.ValidationError("Only CSV files are allowed.")
        return value
        
    def get_file_path(self, obj):
        return obj.file.url
