import axios from 'axios';
import { Interview, UploadResponse, InterviewStatus } from '@/types/interview';

// Use Next.js API routes instead of direct backend calls
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const interviewApi = {
  // Upload interview file
  uploadInterview: async (file: File): Promise<Interview> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/interviews/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all interviews
  getInterviews: async (): Promise<Interview[]> => {
    try {
      const response = await api.get('/interviews');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
      return mockInterviews;
    }
  },

  // Get single interview
  getInterview: async (id: string): Promise<Interview> => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
  },

  // Start transcription
  transcribeInterview: async (id: string): Promise<UploadResponse> => {
    const response = await api.post(`/interviews/${id}/transcribe`);
    return response.data;
  },

  // Get interview status
  getInterviewStatus: async (id: string): Promise<InterviewStatus> => {
    const response = await api.get(`/interviews/${id}/status`);
    return response.data;
  },

  // Delete interview
  deleteInterview: async (id: string): Promise<{ ok: boolean; message: string }> => {
    const response = await api.delete(`/interviews/${id}`);
    return response.data;
  },

  // Export interview
  exportInterview: async (id: string, format: string = 'json'): Promise<any> => {
    const response = await api.get(`/interviews/${id}/export?format=${format}`);
    return response.data;
  },

  // Search transcript
  searchTranscript: async (id: string, query: string): Promise<any> => {
    const response = await api.get(`/interviews/${id}/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get keywords
  getKeywords: async (id: string): Promise<any> => {
    const response = await api.get(`/interviews/${id}/keywords`);
    return response.data;
  },

  // Get questions
  getQuestions: async (id: string): Promise<any> => {
    const response = await api.get(`/interviews/${id}/questions`);
    return response.data;
  },

  // Get topics
  getTopics: async (id: string): Promise<any> => {
    const response = await api.get(`/interviews/${id}/topics`);
    return response.data;
  },

  // Get speaker analysis
  getSpeakerAnalysis: async (id: string): Promise<any> => {
    const response = await api.get(`/interviews/${id}/speaker-analysis`);
    return response.data;
  },

  // Add tag
  addTag: async (id: string, tag: any): Promise<any> => {
    const response = await api.post(`/interviews/${id}/tags`, tag);
    return response.data;
  },

  // Delete tag
  deleteTag: async (id: string, tagId: string): Promise<any> => {
    const response = await api.delete(`/interviews/${id}/tags/${tagId}`);
    return response.data;
  },
};

// Mock data for development
export const mockInterviews: Interview[] = [
  {
    id: '1',
    filename: 'interview_1.mp4',
    original_name: 'Software_Developer_Interview_1.mp4',
    file_size: 52428800,
    file_path: '/uploads/interview_1.mp4',
    cloudinary_url: 'https://res.cloudinary.com/ochibe/video/upload/v1756161414/interview-videos/interview_1.mp4',
    cloudinary_public_id: 'interview-videos/interview_1',
    upload_date: '2024-01-15T10:30:00Z',
    status: 'completed',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:35:00Z',
  },
  {
    id: '2',
    filename: 'interview_2.mp3',
    original_name: 'Product_Manager_Interview_2.mp3',
    file_size: 31457280,
    file_path: '/uploads/interview_2.mp3',
    cloudinary_url: 'https://res.cloudinary.com/ochibe/video/upload/v1756161414/interview-videos/interview_2.mp3',
    cloudinary_public_id: 'interview-videos/interview_2',
    upload_date: '2024-01-14T14:20:00Z',
    status: 'processing',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:22:00Z',
  },
  {
    id: '3',
    filename: 'interview_3.wav',
    original_name: 'Designer_Interview_3.wav',
    file_size: 20971520,
    file_path: '/uploads/interview_3.wav',
    cloudinary_url: 'https://res.cloudinary.com/ochibe/video/upload/v1756161414/interview-videos/interview_3.wav',
    cloudinary_public_id: 'interview-videos/interview_3',
    upload_date: '2024-01-13T09:15:00Z',
    status: 'uploaded',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
  },
];
