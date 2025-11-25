import { NextRequest, NextResponse } from 'next/server';
import { INTERVIEW_API_URL } from '@/lib/api-endpoints';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const backendUrl = `${INTERVIEW_API_URL.BASE_URL}${INTERVIEW_API_URL.TRANSCRIBE}/${id}/transcribe`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error starting transcription:', error);
    return NextResponse.json(
      { error: 'Failed to start transcription' },
      { status: 500 }
    );
  }
}
