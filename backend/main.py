from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from uuid import uuid4
from datetime import datetime
import os, shutil, time, json, re
import cloudinary
import cloudinary.uploader
import cloudinary.api
from contextlib import asynccontextmanager

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("python-dotenv not installed, using system environment variables")

UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME = os.environ.get("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.environ.get("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.environ.get("CLOUDINARY_API_SECRET")

# Configure Cloudinary if credentials are provided
if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET
    )
    USE_CLOUDINARY = True
    print(f" Cloudinary configured successfully!")
    print(f"   Cloud Name: {CLOUDINARY_CLOUD_NAME}")
    print(f"   API Key: {CLOUDINARY_API_KEY[:8]}...")
    print(f"   API Secret: {CLOUDINARY_API_SECRET[:8]}...")
else:
    USE_CLOUDINARY = False
    print("  Warning: Cloudinary credentials not found. Files will be stored locally.")
    print("   Make sure your .env file contains:")
    print("   CLOUDINARY_CLOUD_NAME=your_cloud_name")
    print("   CLOUDINARY_API_KEY=your_api_key")
    print("   CLOUDINARY_API_SECRET=your_api_secret")

app = FastAPI(title="Interview Transcription Stub API")

print(" Starting HR Interview Transcription API...")
print(f" Upload directory: {UPLOAD_DIR}")
print(f"  Cloudinary enabled: {USE_CLOUDINARY}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(" API startup complete!")
    print(f" Sample transcript loaded: {len(SAMPLE_TRANSCRIPT.get('transcript', []))} items")
    print(f" Sample analysis loaded: {len(SAMPLE_ANALYSIS.get('keywords', []))} keywords")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptItem(BaseModel):
    start: float
    end: float
    text: str

class Analysis(BaseModel):
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    sentiment_score: Optional[float] = None
    keywords: Optional[List[str]] = None
    questions: Optional[List[Dict[str, str]]] = None
    topics: Optional[List[Dict[str, Any]]] = None
    speaker_analysis: Optional[Dict[str, Any]] = None

class Tag(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    text: str
    start_time: float
    end_time: float
    color: str = "#3B82F6"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SearchResult(BaseModel):
    text: str
    start_time: float
    end_time: float
    line_number: int

class Interview(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    filename: str
    original_name: str
    file_size: int
    file_path: str
    cloudinary_url: Optional[str] = None
    cloudinary_public_id: Optional[str] = None
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    status: str = "uploaded"  # uploaded, processing, completed, failed
    transcript: Optional[List[TranscriptItem]] = None
    analysis: Optional[Analysis] = None
    tags: List[Tag] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

DB: Dict[str, Interview] = {}

def _load_sample(path: str):
    try:
        with open(path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"  Warning: {path} not found, using default sample data")
        return None
    except Exception as e:
        print(f"  Error loading {path}: {e}, using default sample data")
        return None

# Load sample data with fallbacks
SAMPLE_TRANSCRIPT = _load_sample("sample_transcript.json")
SAMPLE_ANALYSIS = _load_sample("sample_analysis.json")

# Fallback sample data if files don't exist
if SAMPLE_TRANSCRIPT is None:
    SAMPLE_TRANSCRIPT = {
        "transcript": [
            {"start": 0.0, "end": 2.5, "text": "Hello, thank you for joining us today for this interview."},
            {"start": 2.5, "end": 5.0, "text": "Could you please tell us a bit about your background and experience?"},
            {"start": 5.0, "end": 8.0, "text": "I have over 5 years of experience in software development, primarily working with React and Node.js."},
            {"start": 8.0, "end": 12.0, "text": "That's great! Can you walk us through a challenging project you've worked on recently?"},
            {"start": 12.0, "end": 18.0, "text": "Recently, I led a team of 4 developers to build a real-time collaboration platform using WebSockets and React."}
        ]
    }

if SAMPLE_ANALYSIS is None:
    SAMPLE_ANALYSIS = {
        "summary": "A comprehensive interview covering the candidate's background, technical experience, and project management skills.",
        "sentiment": "positive",
        "sentiment_score": 0.78,
        "keywords": ["React", "Node.js", "WebSockets", "team leadership", "collaboration"],
        "questions": [
            {"question": "Could you please tell us a bit about your background and experience?", "answer": "I have over 5 years of experience in software development, primarily working with React and Node.js.", "category": "background"},
            {"question": "Can you walk us through a challenging project you've worked on recently?", "answer": "Recently, I led a team of 4 developers to build a real-time collaboration platform using WebSockets and React.", "category": "technical"}
        ],
        "topics": [
            {"name": "Software Development", "confidence": 0.95, "mentions": 3},
            {"name": "Team Leadership", "confidence": 0.88, "mentions": 2},
            {"name": "React", "confidence": 0.92, "mentions": 2}
        ],
        "speaker_analysis": {
            "total_speakers": 2,
            "speaker_1": {"duration": 8.5, "words": 45},
            "speaker_2": {"duration": 9.5, "words": 52}
        }
    }

@app.post("/api/interviews/upload", response_model=Interview)
async def upload_interview(file: UploadFile = File(...)):
    # Handle cases where filename might be missing or empty
    original_filename = file.filename or "unknown_file"
    
    # Debug logging
    print(f"DEBUG: Original filename: {original_filename}")
    print(f"DEBUG: Content type: {file.content_type}")
    print(f"DEBUG: File size: {file.size}")
    
    # Try to get filename from content-disposition header if available
    if not file.filename and hasattr(file, 'headers'):
        content_disposition = file.headers.get('content-disposition', '')
        if 'filename=' in content_disposition:
            import re
            match = re.search(r'filename="?([^"]+)"?', content_disposition)
            if match:
                original_filename = match.group(1)
    
    # Extract file extension more robustly
    filename = original_filename.lower()
    ext = os.path.splitext(filename)[1]
    
    print(f"DEBUG: Extracted extension: '{ext}'")
    
    # If no extension found or empty extension, try to infer from content type
    if not ext or ext == '':
        if file.content_type:
            content_type_to_ext = {
                'audio/mpeg': '.mp3',
                'audio/wav': '.wav',
                'audio/mp3': '.mp3',
                'video/mp4': '.mp4',
                'video/quicktime': '.mov',
                'video/x-msvideo': '.avi'
            }
            ext = content_type_to_ext.get(file.content_type.lower(), '.mp4')  # default to mp4
            print(f"DEBUG: Inferred extension from content type: {ext}")
        else:
            # If no content type either, default to mp4 for video files
            ext = '.mp4'
            print(f"DEBUG: Using default extension: {ext}")
    
    # Define allowed extensions (with and without dot for flexibility)
    allowed_extensions = {".mp3", ".wav", ".mp4", ".mov", "mp3", "wav", "mp4", "mov"}
    
    # Check if extension is allowed (with or without dot)
    if ext not in allowed_extensions and ext.lstrip('.') not in allowed_extensions:
        # For debugging, let's be more lenient and accept mp4 by default
        if file.content_type and 'video' in file.content_type.lower():
            ext = '.mp4'
        elif file.content_type and 'audio' in file.content_type.lower():
            ext = '.mp3'
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported format '{ext}'. Allowed formats: MP3, WAV, MP4, MOV. Content-Type: {file.content_type}. Filename: {original_filename}"
            )
    
    # Ensure extension has dot for consistency
    if not ext.startswith('.'):
        ext = '.' + ext
    
    contents = await file.read()
    if len(contents) > 100 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (>100MB)")
    
    file_id = str(uuid4())
    stored_name = f"{file_id}{ext}"
    out_path = os.path.join(UPLOAD_DIR, stored_name)
    
    # Store file locally as backup
    with open(out_path, "wb") as f:
        f.write(contents)
    
    cloudinary_url = None
    cloudinary_public_id = None
    
    # Upload to Cloudinary if configured
    if USE_CLOUDINARY:
        try:
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                out_path,
                resource_type="video" if ext in ['.mp4', '.mov'] else "auto",
                folder="interview-videos",
                public_id=f"interview_{file_id}",
                overwrite=True
            )
            cloudinary_url = upload_result.get('secure_url')
            cloudinary_public_id = upload_result.get('public_id')
            print(f"DEBUG: Uploaded to Cloudinary: {cloudinary_url}")
        except Exception as e:
            print(f"DEBUG: Cloudinary upload failed: {e}")
            # Continue with local storage if Cloudinary fails
    
    interview = Interview(
        id=file_id,
        filename=stored_name,
        original_name=original_filename,
        file_size=len(contents),
        file_path=out_path,
        cloudinary_url=cloudinary_url,
        cloudinary_public_id=cloudinary_public_id,
        status="uploaded",
    )
    DB[file_id] = interview
    return interview

@app.get("/api/interviews", response_model=List[Interview])
async def list_interviews(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    interviews = list(DB.values())
    
    # Filter by status
    if status:
        interviews = [i for i in interviews if i.status == status]
    
    # Search in filename and original name
    if search:
        search_lower = search.lower()
        interviews = [
            i for i in interviews 
            if search_lower in i.original_name.lower() or search_lower in i.filename.lower()
        ]
    
    # Sort by upload date (newest first)
    interviews.sort(key=lambda x: x.upload_date, reverse=True)
    
    # Apply pagination
    total = len(interviews)
    interviews = interviews[offset:offset + limit]
    
    return interviews

@app.get("/api/interviews/{interview_id}", response_model=Interview)
async def get_interview(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    return DB[interview_id]

def _simulate_transcription(interview_id: str):
    # Simulate processing
    try:
        DB[interview_id].status = "processing"
        DB[interview_id].updated_at = datetime.utcnow()
        time.sleep(2)  # simulate queue
        # attach sample transcript & analysis
        DB[interview_id].transcript = [TranscriptItem(**t) for t in SAMPLE_TRANSCRIPT["transcript"]]
        DB[interview_id].analysis = Analysis(**SAMPLE_ANALYSIS)
        DB[interview_id].status = "completed"
        DB[interview_id].updated_at = datetime.utcnow()
    except Exception as e:
        DB[interview_id].status = "failed"
        DB[interview_id].updated_at = datetime.utcnow()

@app.post("/api/interviews/{interview_id}/transcribe")
async def transcribe(interview_id: str, background_tasks: BackgroundTasks):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    interview = DB[interview_id]
    if interview.status in {"processing", "completed"}:
        return {"ok": True, "status": interview.status}
    background_tasks.add_task(_simulate_transcription, interview_id)
    return {"ok": True, "status": "processing"}

@app.get("/api/interviews/{interview_id}/status")
async def status(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    return {"status": DB[interview_id].status}

@app.get("/api/interviews/{interview_id}/file")
async def get_interview_file(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    interview = DB[interview_id]
    
    # Return Cloudinary URL if available
    if interview.cloudinary_url:
        return {"url": interview.cloudinary_url, "type": "cloudinary"}
    
    # Fallback to local file
    if not os.path.exists(interview.file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(interview.file_path, filename=interview.original_name)

@app.get("/api/interviews/{interview_id}/search")
async def search_transcript(
    interview_id: str, 
    query: str = Query(..., min_length=1),
    case_sensitive: bool = Query(False)
):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    interview = DB[interview_id]
    if not interview.transcript:
        raise HTTPException(status_code=404, detail="Transcript not available")
    
    results = []
    flags = 0 if case_sensitive else re.IGNORECASE
    
    for i, item in enumerate(interview.transcript):
        if re.search(query, item.text, flags):
            results.append(SearchResult(
                text=item.text,
                start_time=item.start,
                end_time=item.end,
                line_number=i
            ))
    
    return {"results": results, "total": len(results)}

@app.post("/api/interviews/{interview_id}/tags")
async def add_tag(interview_id: str, tag: Tag):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = DB[interview_id]
    interview.tags.append(tag)
    interview.updated_at = datetime.utcnow()
    
    return tag

@app.delete("/api/interviews/{interview_id}/tags/{tag_id}")
async def delete_tag(interview_id: str, tag_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = DB[interview_id]
    interview.tags = [tag for tag in interview.tags if tag.id != tag_id]
    interview.updated_at = datetime.utcnow()
    
    return {"ok": True}

@app.get("/api/interviews/{interview_id}/export")
async def export_interview(interview_id: str, format: str = Query("json")):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = DB[interview_id]
    
    if format.lower() == "json":
        return {
            "interview": interview.dict(),
            "exported_at": datetime.utcnow().isoformat()
        }
    elif format.lower() == "txt":
        content = f"Interview: {interview.original_name}\n"
        content += f"Upload Date: {interview.upload_date}\n"
        content += f"Status: {interview.status}\n\n"
        
        if interview.analysis and interview.analysis.summary:
            content += f"SUMMARY:\n{interview.analysis.summary}\n\n"
        
        if interview.transcript:
            content += "TRANSCRIPT:\n"
            for item in interview.transcript:
                content += f"[{item.start:.1f}s - {item.end:.1f}s] {item.text}\n"
        
        if interview.tags:
            content += "\nTAGS:\n"
            for tag in interview.tags:
                content += f"[{tag.start_time:.1f}s - {tag.end_time:.1f}s] {tag.text}\n"
        
        return {"content": content, "filename": f"{interview_id}_export.txt"}
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")

@app.get("/api/interviews/{interview_id}/keywords")
async def get_keywords(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = DB[interview_id]
    if not interview.analysis or not interview.analysis.keywords:
        return {"keywords": []}
    
    return {"keywords": interview.analysis.keywords}

@app.get("/api/interviews/{interview_id}/questions")
async def get_questions(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = DB[interview_id]
    if not interview.analysis or not interview.analysis.questions:
        return {"questions": []}
    
    return {"questions": interview.analysis.questions}

@app.get("/api/interviews/{interview_id}/topics")
async def get_topics(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = DB[interview_id]
    if not interview.analysis or not interview.analysis.topics:
        return {"topics": []}
    
    return {"topics": interview.analysis.topics}

@app.get("/api/interviews/{interview_id}/speaker-analysis")
async def get_speaker_analysis(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = DB[interview_id]
    if not interview.analysis or not interview.analysis.speaker_analysis:
        return {"speaker_analysis": {}}
    
    return {"speaker_analysis": interview.analysis.speaker_analysis}

@app.get("/api/stats")
async def get_stats():
    total_interviews = len(DB)
    completed_interviews = len([i for i in DB.values() if i.status == "completed"])
    processing_interviews = len([i for i in DB.values() if i.status == "processing"])
    failed_interviews = len([i for i in DB.values() if i.status == "failed"])
    
    total_duration = sum(
        (i.transcript[-1].end if i.transcript else 0) 
        for i in DB.values() 
        if i.transcript
    )
    
    return {
        "total_interviews": total_interviews,
        "completed_interviews": completed_interviews,
        "processing_interviews": processing_interviews,
        "failed_interviews": failed_interviews,
        "total_duration_minutes": round(total_duration / 60, 2),
        "average_duration_minutes": round(total_duration / 60 / completed_interviews, 2) if completed_interviews > 0 else 0
    }

@app.delete("/api/interviews/{interview_id}")
async def delete_interview(interview_id: str):
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = DB[interview_id]
    
    # Delete from Cloudinary if available
    if USE_CLOUDINARY and interview.cloudinary_public_id:
        try:
            cloudinary.uploader.destroy(interview.cloudinary_public_id, resource_type="video")
            print(f"DEBUG: Deleted from Cloudinary: {interview.cloudinary_public_id}")
        except Exception as e:
            print(f"DEBUG: Cloudinary deletion failed: {e}")
    
    # Delete the local file if it exists
    if os.path.exists(interview.file_path):
        try:
            os.remove(interview.file_path)
        except OSError:
            pass  # File might already be deleted
    
    # Remove from database
    del DB[interview_id]
    
    return {"ok": True, "message": "Interview deleted successfully"}

@app.get("/api/health")
async def health_check():
    cloudinary_status = "disabled"
    if USE_CLOUDINARY:
        try:
            # Test Cloudinary connection by getting account info
            result = cloudinary.api.ping()
            cloudinary_status = "connected" if result.get("status") == "ok" else "error"
        except Exception as e:
            cloudinary_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "total_interviews": len(DB),
        "cloudinary_enabled": USE_CLOUDINARY,
        "cloudinary_status": cloudinary_status
    }

@app.get("/api/interviews/{interview_id}/cloudinary-url")
async def get_cloudinary_url(interview_id: str):
    """Get Cloudinary URL for an interview if available"""
    if interview_id not in DB:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview = DB[interview_id]
    
    if interview.cloudinary_url:
        return {
            "url": interview.cloudinary_url,
            "public_id": interview.cloudinary_public_id,
            "type": "cloudinary"
        }
    else:
        return {
            "url": None,
            "public_id": None,
            "type": "local",
            "message": "File not uploaded to Cloudinary"
        }

@app.post("/api/debug/upload-test")
async def debug_upload_test(file: UploadFile = File(...)):
    """Debug endpoint to test file upload validation"""
    
    # Get all available information about the file
    debug_info = {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": file.size,
        "headers": dict(file.headers) if hasattr(file, 'headers') else {},
        "has_filename": bool(file.filename),
        "filename_length": len(file.filename) if file.filename else 0
    }
    
    # Try to extract filename from headers if not available
    if not file.filename and hasattr(file, 'headers'):
        content_disposition = file.headers.get('content-disposition', '')
        debug_info["content_disposition"] = content_disposition
        
        if 'filename=' in content_disposition:
            import re
            match = re.search(r'filename="?([^"]+)"?', content_disposition)
            if match:
                debug_info["extracted_filename"] = match.group(1)
    
    # Process filename if available
    if file.filename:
        filename = file.filename.lower()
        ext = os.path.splitext(filename)[1]
        debug_info.update({
            "filename_lower": filename,
            "extension": ext,
            "extension_without_dot": ext.lstrip('.'),
            "is_allowed": ext in {".mp3", ".wav", ".mp4", ".mov"} or ext.lstrip('.') in {"mp3", "wav", "mp4", "mov"}
        })
    
    # Try to infer extension from content type
    if file.content_type:
        content_type_to_ext = {
            'audio/mpeg': '.mp3',
            'audio/wav': '.wav',
            'audio/mp3': '.mp3',
            'video/mp4': '.mp4',
            'video/quicktime': '.mov',
            'video/x-msvideo': '.avi'
        }
        inferred_ext = content_type_to_ext.get(file.content_type.lower())
        debug_info["inferred_extension"] = inferred_ext
    
    return debug_info