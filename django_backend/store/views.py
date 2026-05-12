import os
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Order

# Loading the environment variables for our external integrations
EXTERNAL_SPACE_DB_URL = os.getenv('EXTERNAL_SPACE_DB_URL')
LOYALTY_API_ENDPOINT = os.getenv('LOYALTY_API_ENDPOINT')
LOYALTY_API_KEY = os.getenv('LOYALTY_API_KEY')

class SyncExternalDatabaseView(APIView):
    """
    Connects to the external "Space" database.
    Replaces the local UI dummy logic with actual DB read/write actions.
    """
    def get(self, request):
        if not EXTERNAL_SPACE_DB_URL:
            return Response({"error": "EXTERNAL_SPACE_DB_URL is not set inside .env"}, status=500)
            
        try:
            # 1. Fetch from Space DB
            response = requests.get(f"{EXTERNAL_SPACE_DB_URL}/products")
            response.raise_for_status()
            return Response(response.json(), status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        if not EXTERNAL_SPACE_DB_URL:
            return Response({"error": "EXTERNAL_SPACE_DB_URL is not set inside .env"}, status=500)
            
        try:
            # 2. Write straight to Space DB
            response = requests.post(f"{EXTERNAL_SPACE_DB_URL}/products", json=request.data)
            response.raise_for_status()
            return Response(response.json(), status=status.HTTP_201_CREATED)
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoyaltyCardAPIView(APIView):
    """
    Bridge backend service to the external Loyalty Card Generator API.
    """
    def post(self, request):
        user_email = request.data.get('email')
        
        # Calculate current purchase metrics
        orders_count = Order.objects.filter(user_email=user_email, status='Approved').count()

        if not LOYALTY_API_ENDPOINT:
            return Response({"error": "LOYALTY_API_ENDPOINT is missing in .env"}, status=500)

        # Contact external Card Generator
        try:
            payload = {
                "email": user_email,
                "orders_count": orders_count,
            }
            headers = {"Authorization": f"Bearer {LOYALTY_API_KEY}"}
            loyalty_res = requests.post(LOYALTY_API_ENDPOINT, json=payload, headers=headers)
            loyalty_res.raise_for_status()
            
            # The service should return an image URL for the generated card
            return Response(loyalty_res.json(), status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CheckoutUploadReceiptView(APIView):
    """
    Finalizes the checkout and accepts multipart/form-data for payment receipts.
    Saves the receipt inside MEDIA_ROOT to be checked by Admins in the dashboard.
    """
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        user_email = request.data.get('email')
        total_amount = request.data.get('total_amount')
        receipt_file = request.FILES.get('receipt') # User's screenshot

        if not receipt_file:
            return Response({"error": "You must upload a payment receipt screenshot via Zain Cash / FIB."}, status=status.HTTP_400_BAD_REQUEST)

        # Record the order and attach the receipt to our database securely
        order = Order.objects.create(
            user_name=request.data.get('name', 'Unknown User'),
            user_email=user_email,
            total_amount=total_amount,
            status='Pending',
            payment_receipt=receipt_file
        )

        return Response({
            "message": "Order created successfully. Receipt uploaded and pending Admin approval.",
            "order_id": order.id
        }, status=status.HTTP_201_CREATED)
