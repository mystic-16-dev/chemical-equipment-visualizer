from django.db import models
from django.contrib.auth.models import User
import os

class UploadedDataset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='datasets')
    dataset_name = models.CharField(max_length=255)
    file = models.FileField(upload_to='datasets/')
    upload_timestamp = models.DateTimeField(auto_now_add=True)
    summary_data = models.JSONField(blank=True, null=True)

    class Meta:
        ordering = ['-upload_timestamp']

    def save(self, *args, **kwargs):
        # Retention Logic: Limit to last 5 uploads per user
        if not self.pk:  # Only on creation
            user_datasets = UploadedDataset.objects.filter(user=self.user).order_by('upload_timestamp')
            if user_datasets.count() >= 5:
                # Delete the oldest one
                oldest_dataset = user_datasets.first()
                if oldest_dataset:
                    # Delete actual file from system
                    if oldest_dataset.file:
                        if os.path.isfile(oldest_dataset.file.path):
                            os.remove(oldest_dataset.file.path)
                    oldest_dataset.delete()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.dataset_name} ({self.user.username})"
