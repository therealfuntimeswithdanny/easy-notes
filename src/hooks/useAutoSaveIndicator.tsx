import { useState, useEffect } from 'react';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export const useAutoSaveIndicator = () => {
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const startSaving = () => setSaveState('saving');
  
  const markSaved = () => {
    setSaveState('saved');
    // Auto-clear the saved state after 2 seconds
    setTimeout(() => setSaveState('idle'), 2000);
  };
  
  const markError = () => {
    setSaveState('error');
    // Auto-clear the error state after 3 seconds
    setTimeout(() => setSaveState('idle'), 3000);
  };

  return {
    saveState,
    startSaving,
    markSaved,
    markError,
  };
};