# Use official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (important for SQLite/PostgreSQL adapters if needed)
RUN apt-get update && apt-get install -y gcc

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project files
COPY . /app/

# Expose port 8000 for Django
EXPOSE 8000

# Run the application using gunicorn for production
CMD ["gunicorn", "ludex_project.wsgi:application", "--bind", "0.0.0.0:8000"]
