import interviewReducer, { 
  setCurrentTime, 
  setIsPlaying, 
  addTag, 
  removeTag,
  setSearchQuery,
  setSearchResults,
  clearSearch,
  setSelectedText,
  setSelectedRange,
  clearError,
  fetchInterviews,
  uploadInterview,
  fetchInterview,
  transcribeInterview,
  deleteInterview
} from '../interviewSlice';

describe('interviewSlice', () => {
  const initialState = {
    interviews: [],
    currentInterview: null,
    loading: false,
    error: null,
    currentTime: 0,
    isPlaying: false,
    tags: [],
    searchResults: [],
    searchQuery: '',
    selectedText: '',
    selectedRange: null,
  };

  it('should handle initial state', () => {
    expect(interviewReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Reducers', () => {
    it('should handle setCurrentTime', () => {
      const actual = interviewReducer(initialState, setCurrentTime(30));
      expect(actual.currentTime).toEqual(30);
    });

    it('should handle setIsPlaying', () => {
      const actual = interviewReducer(initialState, setIsPlaying(true));
      expect(actual.isPlaying).toEqual(true);
    });

    it('should handle addTag', () => {
      const tag = {
        id: '1',
        text: 'Important',
        color: '#ff0000',
        start_time: 10,
        end_time: 15,
        created_at: new Date().toISOString(),
      };
      const actual = interviewReducer(initialState, addTag(tag));
      expect(actual.tags).toHaveLength(1);
      expect(actual.tags[0]).toEqual(tag);
    });

    it('should handle removeTag', () => {
      const stateWithTag = {
        ...initialState,
        tags: [{ 
          id: '1', 
          text: 'Important', 
          color: '#ff0000', 
          start_time: 10, 
          end_time: 15,
          created_at: new Date().toISOString(),
        }],
      };
      const actual = interviewReducer(stateWithTag, removeTag('1'));
      expect(actual.tags).toHaveLength(0);
    });

    it('should handle setSearchQuery', () => {
      const actual = interviewReducer(initialState, setSearchQuery('test query'));
      expect(actual.searchQuery).toEqual('test query');
    });

    it('should handle setSearchResults', () => {
      const searchResults = [
        { text: 'test', start_time: 0, end_time: 5, line_number: 0 }
      ];
      const actual = interviewReducer(initialState, setSearchResults(searchResults));
      expect(actual.searchResults).toEqual(searchResults);
    });

    it('should handle clearSearch', () => {
      const stateWithSearch = {
        ...initialState,
        searchQuery: 'test',
        searchResults: [{ text: 'test', start_time: 0, end_time: 5, line_number: 0 }],
      };
      const actual = interviewReducer(stateWithSearch, clearSearch());
      expect(actual.searchQuery).toEqual('');
      expect(actual.searchResults).toHaveLength(0);
    });

    it('should handle setSelectedText', () => {
      const actual = interviewReducer(initialState, setSelectedText('selected text'));
      expect(actual.selectedText).toEqual('selected text');
    });

    it('should handle setSelectedRange', () => {
      const range = { start: 10, end: 20 };
      const actual = interviewReducer(initialState, setSelectedRange(range));
      expect(actual.selectedRange).toEqual(range);
    });

    it('should handle clearError', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error occurred',
      };
      const actual = interviewReducer(stateWithError, clearError());
      expect(actual.error).toBeNull();
    });
  });

  describe('Async Thunks', () => {
    it('should handle fetchInterviews.pending', () => {
      const actual = interviewReducer(initialState, fetchInterviews.pending);
      expect(actual.loading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should handle fetchInterviews.fulfilled', () => {
      const mockInterviews = [
        { id: '1', filename: 'test.mp4', original_name: 'Test Interview', file_size: 1000, file_path: '/test', upload_date: '2024-01-01', status: 'completed', created_at: '2024-01-01', updated_at: '2024-01-01' }
      ];
      const actual = interviewReducer(initialState, fetchInterviews.fulfilled(mockInterviews, ''));
      expect(actual.loading).toBe(false);
      expect(actual.interviews).toEqual(mockInterviews);
    });

    it('should handle fetchInterviews.rejected', () => {
      const actual = interviewReducer(initialState, fetchInterviews.rejected(new Error('Failed'), ''));
      expect(actual.loading).toBe(false);
      expect(actual.error).toBe('Failed');
    });

    it('should handle uploadInterview.fulfilled', () => {
      const mockInterview = { id: '1', filename: 'test.mp4', original_name: 'Test Interview', file_size: 1000, file_path: '/test', upload_date: '2024-01-01', status: 'uploaded', created_at: '2024-01-01', updated_at: '2024-01-01' };
      const actual = interviewReducer(initialState, uploadInterview.fulfilled(mockInterview, '', new File([], 'test.mp4')));
      expect(actual.loading).toBe(false);
      expect(actual.interviews).toContain(mockInterview);
    });

    it('should handle fetchInterview.fulfilled', () => {
      const mockInterview = { id: '1', filename: 'test.mp4', original_name: 'Test Interview', file_size: 1000, file_path: '/test', upload_date: '2024-01-01', status: 'completed', created_at: '2024-01-01', updated_at: '2024-01-01', tags: [] };
      const actual = interviewReducer(initialState, fetchInterview.fulfilled(mockInterview, '', '1'));
      expect(actual.loading).toBe(false);
      expect(actual.currentInterview).toEqual(mockInterview);
      expect(actual.tags).toEqual([]);
    });

    it('should handle transcribeInterview.fulfilled', () => {
      const stateWithInterview = {
        ...initialState,
        interviews: [{ id: '1', filename: 'test.mp4', original_name: 'Test Interview', file_size: 1000, file_path: '/test', upload_date: '2024-01-01', status: 'uploaded', created_at: '2024-01-01', updated_at: '2024-01-01' }],
        currentInterview: { id: '1', filename: 'test.mp4', original_name: 'Test Interview', file_size: 1000, file_path: '/test', upload_date: '2024-01-01', status: 'uploaded', created_at: '2024-01-01', updated_at: '2024-01-01' },
      };
      const actual = interviewReducer(stateWithInterview, transcribeInterview.fulfilled({ id: '1', response: { ok: true } }, '', '1'));
      expect(actual.loading).toBe(false);
      expect(actual.interviews[0].status).toBe('processing');
      expect(actual.currentInterview?.status).toBe('processing');
    });

    it('should handle deleteInterview.fulfilled', () => {
      const stateWithInterview = {
        ...initialState,
        interviews: [{ id: '1', filename: 'test.mp4', original_name: 'Test Interview', file_size: 1000, file_path: '/test', upload_date: '2024-01-01', status: 'completed', created_at: '2024-01-01', updated_at: '2024-01-01' }],
        currentInterview: { id: '1', filename: 'test.mp4', original_name: 'Test Interview', file_size: 1000, file_path: '/test', upload_date: '2024-01-01', status: 'completed', created_at: '2024-01-01', updated_at: '2024-01-01' },
      };
      const actual = interviewReducer(stateWithInterview, deleteInterview.fulfilled({ id: '1', response: { ok: true } }, '', '1'));
      expect(actual.loading).toBe(false);
      expect(actual.interviews).toHaveLength(0);
      expect(actual.currentInterview).toBeNull();
    });
  });
});
