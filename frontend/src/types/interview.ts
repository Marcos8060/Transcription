export interface TranscriptItem {
  start: number;
  end: number;
  text: string;
}

export interface Analysis {
  summary?: string;
  sentiment?: string;
  keywords?: string[];
  questions?: Array<{
    question: string;
    answer: string;
  }>;
  metrics?: {
    total_duration: number;
    speaker_turns: number;
    average_response_length: number;
    technical_terms_count: number;
    confidence_score: number;
  };
}

export interface Interview {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  file_path: string;
  cloudinary_url?: string;
  cloudinary_public_id?: string;
  upload_date: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  transcript?: TranscriptItem[];
  analysis?: Analysis;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  ok: boolean;
  status: string;
}

export interface InterviewStatus {
  status: string;
}

export interface Tag {
  id: string;
  text: string;
  color: string;
  start: number;
  end: number;
}

export interface SearchResult {
  text: string;
  start: number;
  end: number;
  index: number;
}
