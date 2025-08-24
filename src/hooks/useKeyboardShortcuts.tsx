import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onNewNote: () => void;
  onSave: () => void;
  onDelete: () => void;
  onSearch: () => void;
  onExport: () => void;
  onTogglePin: () => void;
}

export const useKeyboardShortcuts = ({
  onNewNote,
  onSave,
  onDelete,
  onSearch,
  onExport,
  onTogglePin,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.contentEditable === 'true' ||
                      target.classList.contains('w-md-editor-text');

      // Ctrl/Cmd + N - New Note
      if ((event.ctrlKey || event.metaKey) && event.key === 'n' && !isTyping) {
        event.preventDefault();
        onNewNote();
        return;
      }

      // Ctrl/Cmd + S - Save (force save)
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave();
        return;
      }

      // Ctrl/Cmd + Delete - Delete Note
      if ((event.ctrlKey || event.metaKey) && event.key === 'Delete' && !isTyping) {
        event.preventDefault();
        onDelete();
        return;
      }

      // Ctrl/Cmd + F - Search
      if ((event.ctrlKey || event.metaKey) && event.key === 'f' && !isTyping) {
        event.preventDefault();
        onSearch();
        return;
      }

      // Ctrl/Cmd + E - Export
      if ((event.ctrlKey || event.metaKey) && event.key === 'e' && !isTyping) {
        event.preventDefault();
        onExport();
        return;
      }

      // Ctrl/Cmd + P - Toggle Pin
      if ((event.ctrlKey || event.metaKey) && event.key === 'p' && !isTyping) {
        event.preventDefault();
        onTogglePin();
        return;
      }

      // Escape - Clear search or deselect
      if (event.key === 'Escape' && !isTyping) {
        // Let components handle this individually
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNewNote, onSave, onDelete, onSearch, onExport, onTogglePin]);
};