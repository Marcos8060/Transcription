# HR Interview Transcription & Analysis API

A FastAPI backend for HR interview transcription and analysis application. This API provides comprehensive endpoints for file upload, transcription, AI analysis, and interview management.

## Features

- **File Upload & Management**: Support for audio/video files (MP3, WAV, MP4, MOV)
- **Transcription**: Automatic transcription with timestamp synchronization
- **AI Analysis**: Comprehensive analysis including summary, sentiment, keywords, Q&A parsing
- **Search & Filtering**: Full-text search in transcripts with highlighting
- **Tagging System**: Add custom tags to specific time segments
- **Export Functionality**: Export interviews in JSON or TXT format
- **Statistics**: Dashboard statistics and analytics
- **Real-time Status**: Background processing with status updates

## Quick Start

### Prerequisites

- Python 3.8+
- Virtual environment (already set up)

### Installation

1. Activate your virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

## API Endpoints

### Core Interview Management

#### Upload Interview
```
POST /api/interviews/upload
```
Upload audio/video files for transcription and analysis.

**Supported formats**: MP3, WAV, MP4, MOV
**Max file size**: 100MB

#### List Interviews
```
GET /api/interviews
```
Get all interviews with optional filtering and pagination.

**Query Parameters**:
- `status`: Filter by status (uploaded, processing, completed, failed)
- `search`: Search in filename
- `limit`: Number of results (1-100, default: 50)
- `offset`: Pagination offset (default: 0)

#### Get Interview Details
```
GET /api/interviews/{interview_id}
```
Get detailed information about a specific interview.

#### Delete Interview
```
DELETE /api/interviews/{interview_id}
```
Delete an interview and its associated files.

### Transcription & Processing

#### Start Transcription
```
POST /api/interviews/{interview_id}/transcribe
```
Start the transcription process for an interview.

#### Get Processing Status
```
GET /api/interviews/{interview_id}/status
```
Get the current processing status of an interview.

### File Access

#### Download Interview File
```
GET /api/interviews/{interview_id}/file
```
Download the original audio/video file. Returns Cloudinary URL if available, otherwise serves local file.

#### Get Cloudinary URL
```
GET /api/interviews/{interview_id}/cloudinary-url
```
Get the Cloudinary URL for an interview if it was uploaded to the cloud.

### Search & Analysis

#### Search Transcript
```
GET /api/interviews/{interview_id}/search?query={search_term}
```
Search within the transcript text.

**Query Parameters**:
- `query`: Search term (required)
- `case_sensitive`: Case-sensitive search (default: false)

#### Get Keywords
```
GET /api/interviews/{interview_id}/keywords
```
Get AI-extracted keywords from the interview.

#### Get Questions & Answers
```
GET /api/interviews/{interview_id}/questions
```
Get parsed Q&A pairs from the interview.

#### Get Topics
```
GET /api/interviews/{interview_id}/topics
```
Get identified topics with confidence scores.

#### Get Speaker Analysis
```
GET /api/interviews/{interview_id}/speaker-analysis
```
Get speaker-specific analysis and statistics.

### Tagging System

#### Add Tag
```
POST /api/interviews/{interview_id}/tags
```
Add a custom tag to a specific time segment.

**Request Body**:
```json
{
  "text": "Important point",
  "start_time": 15.5,
  "end_time": 18.0,
  "color": "#3B82F6"
}
```

#### Delete Tag
```
DELETE /api/interviews/{interview_id}/tags/{tag_id}
```
Remove a specific tag.

### Export & Utilities

#### Export Interview
```
GET /api/interviews/{interview_id}/export?format={format}
```
Export interview data in various formats.

**Supported formats**: `json`, `txt`

#### Get Statistics
```
GET /api/stats
```
Get overall statistics and analytics.

#### Health Check
```
GET /api/health
```
Check API health and status.

## Data Models

### Interview
```json
{
  "id": "uuid",
  "filename": "stored_filename.ext",
  "original_name": "original_filename.ext",
  "file_size": 1234567,
  "file_path": "/path/to/file",
  "upload_date": "2024-01-01T12:00:00Z",
  "status": "completed",
  "transcript": [...],
  "analysis": {...},
  "tags": [...],
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### Transcript Item
```json
{
  "start": 0.0,
  "end": 2.5,
  "text": "Hello, thank you for joining us today..."
}
```

### Analysis
```json
{
  "summary": "Comprehensive interview summary...",
  "sentiment": "positive",
  "sentiment_score": 0.78,
  "keywords": ["React", "Node.js", "Python"],
  "questions": [...],
  "topics": [...],
  "speaker_analysis": {...}
}
```

## Sample Data

The API includes sample data for testing:
- `sample_transcript.json`: Sample interview transcript with timestamps
- `sample_analysis.json`: Sample AI analysis results

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid file format, file too large)
- `404`: Not Found (interview not found)
- `500`: Internal Server Error

## Development

### Project Structure
```
nexus-backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── sample_transcript.json  # Sample transcript data
├── sample_analysis.json    # Sample analysis data
├── uploads/             # Uploaded files directory
└── README.md           # This file
```

### Environment Variables
- `UPLOAD_DIR`: Directory for uploaded files (default: `./uploads`)
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Cloudinary Setup (Optional)
For cloud video storage, set up Cloudinary:

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Set environment variables:
   ```bash
   export CLOUDINARY_CLOUD_NAME=your_cloud_name
   export CLOUDINARY_API_KEY=your_api_key
   export CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Or create a `.env` file with the same variables

The API will automatically use Cloudinary if credentials are provided, otherwise fall back to local storage.

### Testing
The API includes sample data for testing all endpoints. Upload any audio/video file and use the transcription endpoint to see the full workflow.

## What I Achieved in 5 Hours

- ✅ Complete FastAPI backend with all required endpoints
- ✅ File upload with validation and storage
- ✅ Transcription simulation with sample data
- ✅ Comprehensive AI analysis features (summary, sentiment, keywords, Q&A, topics)
- ✅ Search functionality with regex support
- ✅ Tagging system for transcript segments
- ✅ Export functionality (JSON/TXT)
- ✅ Statistics and analytics endpoints
- ✅ Proper error handling and validation
- ✅ CORS middleware for frontend integration
- ✅ Background task processing
- ✅ File management and cleanup
- ✅ Comprehensive API documentation

## Known Limitations

- Uses in-memory storage (not persistent across restarts)
- Transcription is simulated (not real AI processing)
- File storage is local (not cloud-based)
- No authentication/authorization
- Limited to supported audio/video formats
- No real-time WebSocket updates

## Next Steps

For production deployment, consider:
- Database integration (PostgreSQL/MongoDB)
- Real AI transcription service integration
- Cloud storage for files
- Authentication and authorization
- Real-time updates via WebSockets
- Rate limiting and caching
- Comprehensive testing suite
