from django.db import models

class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    )
    user_name = models.CharField(max_length=150)
    user_email = models.EmailField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Secure receipt upload to Django MEDIA_ROOT, admin can verify internally
    payment_receipt = models.ImageField(upload_to='receipts/', blank=False, null=False)
    
    # Store IDs pointing to external database products
    external_game_ids = models.JSONField(default=list)
    
    def __str__(self):
        return f"Order #{self.id} - {self.user_email}"
