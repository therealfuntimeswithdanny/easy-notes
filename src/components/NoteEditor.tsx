import { useState, useCallback, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
}

export const NoteEditor = ({ note, onUpdateNote }: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id, note.title, note.content]);

  // Debounced save functions
  const debouncedSaveTitle = useCallback(
    debounce((newTitle: string) => {
      if (newTitle !== note.title) {
        onUpdateNote(note.id, { title: newTitle });
      }
    }, 500),
    [note.id, note.title, onUpdateNote]
  );

  const debouncedSaveContent = useCallback(
    debounce((newContent: string) => {
      if (newContent !== note.content) {
        onUpdateNote(note.id, { content: newContent });
      }
    }, 1000),
    [note.id, note.content, onUpdateNote]
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSaveTitle(newTitle);
  };

  const handleContentChange = (newContent: string = '') => {
    setContent(newContent);
    debouncedSaveContent(newContent);
  };

  return (
    <div className="h-full flex flex-col bg-editor-bg">
      {/* Title */}
      <div className="p-4 sm:p-6 border-b bg-card/50">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-lg sm:text-xl font-semibold border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Note title..."
        />
      </div>

      {/* Markdown Editor */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="h-full">
          <MDEditor
            value={content}
            onChange={handleContentChange}
            height="100%"
            preview="edit"
            hideToolbar={false}
            data-color-mode="light"
            className="!bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};