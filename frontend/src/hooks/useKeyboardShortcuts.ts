import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { setIsPlaying, setCurrentTime } from '@/redux/features/interviewSlice';

export const useKeyboardShortcuts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isPlaying, currentTime } = useSelector((state: RootState) => state.interview);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          dispatch(setIsPlaying(!isPlaying));
          break;
        case 'arrowleft':
          event.preventDefault();
          dispatch(setCurrentTime(Math.max(0, currentTime - 10)));
          break;
        case 'arrowright':
          event.preventDefault();
          dispatch(setCurrentTime(currentTime + 10));
          break;
        case 'home':
          event.preventDefault();
          dispatch(setCurrentTime(0));
          break;
        case 'end':
          event.preventDefault();
          // We'll need to get duration from the player component
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isPlaying, currentTime]);
};
