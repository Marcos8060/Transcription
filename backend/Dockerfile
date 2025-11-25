# backend/Dockerfile

# Use Python 3.11 slim as base image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose port 8000 (FastAPI default)
EXPOSE 8000

# Command to run FastAPI with Uvicorn
CMD ["python", "start_server.py"]
