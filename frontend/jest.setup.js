import '@testing-library/jest-dom'

// Mock testing library DOM
jest.mock('@testing-library/dom', () => ({
  ...jest.requireActual('@testing-library/dom'),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock Redux store
jest.mock('@/redux/store', () => ({
  store: {
    getState: jest.fn(() => ({
      interview: {
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
      }
    })),
    dispatch: jest.fn(),
  },
  RootState: {},
  AppDispatch: jest.fn(),
}))

// Mock Redux Provider
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  Provider: ({ children }) => children,
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
}))

// Mock API module
jest.mock('@/lib/api', () => ({
  interviewApi: {
    getInterviews: jest.fn(() => Promise.resolve([])),
    uploadInterview: jest.fn(() => Promise.resolve({})),
    getInterview: jest.fn(() => Promise.resolve({})),
    transcribeInterview: jest.fn(() => Promise.resolve({})),
    deleteInterview: jest.fn(() => Promise.resolve({})),
    exportInterview: jest.fn(() => Promise.resolve({})),
    searchTranscript: jest.fn(() => Promise.resolve([])),
    getKeywords: jest.fn(() => Promise.resolve([])),
    getQuestions: jest.fn(() => Promise.resolve([])),
    getTopics: jest.fn(() => Promise.resolve([])),
    getSpeakerAnalysis: jest.fn(() => Promise.resolve({})),
    addTag: jest.fn(() => Promise.resolve({})),
    removeTag: jest.fn(() => Promise.resolve({})),
  },
}))

// Global test setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))
