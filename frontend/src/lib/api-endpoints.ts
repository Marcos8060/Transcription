

//------------------------ Interview APIs ----------------------//
export const INTERVIEW_API_URL = {
  // Base URL for backend API
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  
  // Interview endpoints
  UPLOAD: '/api/interviews/upload',
  LIST: '/api/interviews',
  GET_BY_ID: '/api/interviews',
  TRANSCRIBE: '/api/interviews',
  STATUS: '/api/interviews',
  FILE: '/api/interviews',
  SEARCH: '/api/interviews',
  TAGS: '/api/interviews',
  DELETE_TAG: '/api/interviews',
  EXPORT: '/api/interviews',
  KEYWORDS: '/api/interviews',
  QUESTIONS: '/api/interviews',
  TOPICS: '/api/interviews',
  SPEAKER_ANALYSIS: '/api/interviews',
  DELETE: '/api/interviews',
  STATS: '/api/stats',
  HEALTH: '/api/health',
};

//------------------------ Application APIs ----------------------//
export const APP_API_URL = {
  
  //-------------- INTERVIEW APIs ------------------//
  INTERVIEWS: "/api/interviews",
  INTERVIEW_UPLOAD: "/api/interviews/upload",
  INTERVIEW_DETAIL: "/api/interviews",
};

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  DELETE: "DELETE",
};
