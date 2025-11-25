"""
Cloudinary Configuration for HR Interview Transcription API

To use Cloudinary for video storage:

1. Sign up for a free Cloudinary account: https://cloudinary.com/
2. Get your credentials from the dashboard
3. Set the following environment variables:

export CLOUDINARY_CLOUD_NAME=your_cloud_name
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret

Or create a .env file with:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Features:
- Videos are uploaded to Cloudinary in the "interview-videos" folder
- Files are stored with unique IDs: interview_{uuid}
- Secure HTTPS URLs are generated for video playback
- Automatic cleanup when interviews are deleted
- Fallback to local storage if Cloudinary is not configured

Benefits:
- Scalable cloud storage
- CDN for fast video delivery
- Automatic video optimization
- No local storage limitations
- Secure and reliable
"""

# Example usage in your application:
"""
from dotenv import load_dotenv
load_dotenv()

# The main.py will automatically detect and use Cloudinary
# if the environment variables are set
"""
