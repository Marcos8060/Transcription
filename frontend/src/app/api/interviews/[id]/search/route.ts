import { NextRequest, NextResponse } from 'next/server';
import { INTERVIEW_API_URL } from '@/lib/api-endpoints';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const caseSensitive = searchParams.get('case_sensitive') || 'false';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const backendUrl = `${INTERVIEW_API_URL.BASE_URL}${INTERVIEW_API_URL.SEARCH}/${id}/search?query=${encodeURIComponent(query)}&case_sensitive=${caseSensitive}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
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
    console.error('Error searching transcript:', error);
    return NextResponse.json(
      { error: 'Failed to search transcript' },
      { status: 500 }
    );
  }
}
