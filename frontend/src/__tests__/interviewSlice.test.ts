import interviewReducer, { 
  setCurrentTime, 
  setIsPlaying, 
  addTag, 
  removeTag,
  setSearchQuery,
  clearSearch 
} from '@/redux/features/interviewSlice';

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
      start: 10,
      end: 15,
    };
    const actual = interviewReducer(initialState, addTag(tag));
    expect(actual.tags).toHaveLength(1);
    expect(actual.tags[0]).toEqual(tag);
  });

  it('should handle removeTag', () => {
    const stateWithTag = {
      ...initialState,
      tags: [{ id: '1', text: 'Important', color: '#ff0000', start: 10, end: 15 }],
    };
    const actual = interviewReducer(stateWithTag, removeTag('1'));
    expect(actual.tags).toHaveLength(0);
  });

  it('should handle setSearchQuery', () => {
    const actual = interviewReducer(initialState, setSearchQuery('test query'));
    expect(actual.searchQuery).toEqual('test query');
  });

  it('should handle clearSearch', () => {
    const stateWithSearch = {
      ...initialState,
      searchQuery: 'test',
      searchResults: [{ text: 'test', start: 0, end: 5, index: 0 }],
    };
    const actual = interviewReducer(stateWithSearch, clearSearch());
    expect(actual.searchQuery).toEqual('');
    expect(actual.searchResults).toHaveLength(0);
  });
});
