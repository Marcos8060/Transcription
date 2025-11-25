#!/usr/bin/env python3
"""
Startup script for the HR Interview Transcription API
"""

import uvicorn
import os

if __name__ == "__main__":
    # Create uploads directory if it doesn't exist
    upload_dir = os.environ.get("UPLOAD_DIR", "./uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
