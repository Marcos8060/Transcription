# API Integration Setup Guide

## 🚀 Quick Setup

### 1. Environment Configuration

Create a `.env.local` file in your project root:

```bash
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Other configurations
NEXT_PUBLIC_APP_NAME=Interview Transcription Platform
```

### 2. Backend Setup

1. **Start the FastAPI backend** on `http://localhost:8000`
2. **Ensure CORS is enabled** (already configured in the backend)
3. **Verify the backend is running** by visiting `http://localhost:8000/api/health`

### 3. Frontend Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Visit the application** at `http://localhost:3000`

## 🔧 API Architecture

### Route Handlers (Next.js API Routes)

The application uses Next.js API route handlers as a proxy to the FastAPI backend:

- **`/api/interviews`** - List all interviews
- **`/api/interviews/upload`** - Upload new interview files
- **`/api/interviews/[id]`** - Get/delete specific interview
- **`/api/interviews/[id]/transcribe`** - Start transcription
- **`/api/interviews/[id]/status`** - Check transcription status

### Redux Integration

The Redux store manages:
- **Interview list** - All uploaded interviews
- **Current interview** - Currently viewed interview
- **Upload state** - File upload progress and status
- **Transcription state** - Processing status
- **UI state** - Player controls, search, tags

### Key Features

✅ **File Upload** - Drag & drop with validation  
✅ **Interview Management** - List, view, delete interviews  
✅ **Transcription** - Start AI transcription process  
✅ **Real-time Status** - Track processing progress  
✅ **Error Handling** - Graceful error management  
✅ **Mock Data Fallback** - Works without backend  

## 🧪 Testing the Integration

### 1. Upload Test
1. Go to `/dashboard/interviews`
2. Upload an audio/video file
3. Verify it appears in the list

### 2. Transcription Test
1. Click "Transcribe" on an uploaded file
2. Watch the status change to "processing"
3. Wait for completion (simulated 2 seconds)

### 3. View Test
1. Click "View" on a completed interview
2. Verify transcript and analysis display

## 🔍 Troubleshooting

### Backend Connection Issues
- Check if FastAPI is running on port 8000
- Verify CORS settings
- Check network connectivity

### Upload Issues
- Ensure file type is supported (MP3, WAV, MP4, MOV)
- Check file size limit (100MB)
- Verify backend storage directory exists

### Redux State Issues
- Check browser console for errors
- Verify API responses
- Check Redux DevTools for state changes

## 📁 File Structure

```
src/
├── app/
│   └── api/                    # Next.js API routes
│       └── interviews/
│           ├── route.ts        # List interviews
│           ├── upload/
│           │   └── route.ts    # Upload files
│           └── [id]/
│               ├── route.ts    # Get/delete interview
│               ├── transcribe/
│               │   └── route.ts # Start transcription
│               └── status/
│                   └── route.ts # Check status
├── lib/
│   ├── api.ts                  # API service functions
│   └── api-endpoints.ts        # API endpoint configuration
└── redux/
    └── features/
        └── interviewSlice.ts   # Redux state management
```

## 🎯 Next Steps

1. **Add more API endpoints** as needed
2. **Implement real-time updates** with WebSocket
3. **Add file streaming** for large files
4. **Implement caching** for better performance
5. **Add authentication** and user management
