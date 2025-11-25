import { NextRequest, NextResponse } from 'next/server';
import { INTERVIEW_API_URL } from '@/lib/api-endpoints';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'video/mp4', 'video/mov', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload audio or video files.' },
        { status: 400 }
      );
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB.' },
        { status: 400 }
      );
    }

    let cloudinaryUrl = null;

    // Upload to Cloudinary if configured
    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
      try {
        cloudinaryUrl = await uploadToCloudinary(file);
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        // Fall back to backend upload
      }
    }

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const backendUrl = `${INTERVIEW_API_URL.BASE_URL}${INTERVIEW_API_URL.UPLOAD}`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // If Cloudinary upload was successful, update the response with Cloudinary data
    if (cloudinaryUrl) {
      data.cloudinary_url = cloudinaryUrl;
      data.cloudinary_public_id = `interview-videos/interview_${data.id}`;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading interview:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload interview' },
      { status: 500 }
    );
  }
}

async function uploadToCloudinary(file: File): Promise<string> {
  // Convert file to base64
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString('base64');
  const dataURI = `data:${file.type};base64,${base64}`;

  // Create form data for Cloudinary
  const formData = new FormData();
  formData.append('file', dataURI);
  formData.append('upload_preset', 'interview_transcription'); // You'll need to create this preset
  formData.append('resource_type', 'video');
  formData.append('folder', 'interviews');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.secure_url;
}
