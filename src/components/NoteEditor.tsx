import { useState, useCallback, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Input } from '@/components/ui/input';
import { TagsInput } from './TagsInput';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { WordCount } from './WordCount';
import { useAutoSaveIndicator } from '@/hooks/useAutoSaveIndicator';
import { useTheme } from './ThemeProvider';
import { debounce } from 'lodash';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  tags: string[];
  category: string;
}

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
}

export const NoteEditor = ({ note, onUpdateNote }: NoteEditorProps) => {
  const { theme } = useTheme();
  const { saveState, startSaving, markSaved, markError } = useAutoSaveIndicator();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags || []);

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
  }, [note.id, note.title, note.content, note.tags]);

  // Debounced save functions
  const debouncedSaveTitle = useCallback(
    debounce(async (newTitle: string) => {
      if (newTitle !== note.title) {
        startSaving();
        try {
          await onUpdateNote(note.id, { title: newTitle });
          markSaved();
        } catch (error) {
          markError();
        }
      }
    }, 500),
    [note.id, note.title, onUpdateNote, startSaving, markSaved, markError]
  );

  const debouncedSaveContent = useCallback(
    debounce(async (newContent: string) => {
      if (newContent !== note.content) {
        startSaving();
        try {
          await onUpdateNote(note.id, { content: newContent });
          markSaved();
        } catch (error) {
          markError();
        }
      }
    }, 1000),
    [note.id, note.content, onUpdateNote, startSaving, markSaved, markError]
  );

  const debouncedSaveTags = useCallback(
    debounce(async (newTags: string[]) => {
      if (JSON.stringify(newTags) !== JSON.stringify(note.tags)) {
        startSaving();
        try {
          await onUpdateNote(note.id, { tags: newTags });
          markSaved();
        } catch (error) {
          markError();
        }
      }
    }, 1000),
    [note.id, note.tags, onUpdateNote, startSaving, markSaved, markError]
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSaveTitle(newTitle);
  };

  const handleContentChange = (newContent: string = '') => {
    setContent(newContent);
    debouncedSaveContent(newContent);
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    debouncedSaveTags(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      // Force save immediately when Ctrl/Cmd + Enter is pressed
      debouncedSaveTitle.flush();
      debouncedSaveContent.flush();
      debouncedSaveTags.flush();
    }
  };

  // Listen for force save event
  useEffect(() => {
    const handleForceSave = () => {
      debouncedSaveTitle.flush();
      debouncedSaveContent.flush();
      debouncedSaveTags.flush();
    };

    document.addEventListener('forceSave', handleForceSave);
    return () => document.removeEventListener('forceSave', handleForceSave);
  }, [debouncedSaveTitle, debouncedSaveContent, debouncedSaveTags]);

  return (
    <div className="h-full flex flex-col bg-editor-bg" onKeyDown={handleKeyDown}>
      {/* Title with Auto-save Indicator */}
      <div className="p-4 sm:p-6 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="text-sm font-medium text-muted-foreground">Title</h2>
          <div className="flex items-center gap-4">
            <WordCount content={content} />
            <AutoSaveIndicator saveState={saveState} />
          </div>
        </div>
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-lg sm:text-xl font-semibold border-none bg-transparent p-0 focus-ring"
          placeholder="Note title..."
        />
      </div>

      {/* Tags */}
      <div className="p-4 sm:p-6 border-b bg-card/30 backdrop-blur-sm">
        <TagsInput
          tags={tags}
          onTagsChange={handleTagsChange}
          placeholder="Add tags... (Ctrl+Enter to save, Ctrl+P to pin)"
        />
      </div>

      {/* Markdown Editor */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="h-full rounded-lg overflow-hidden border border-border/50">
          <MDEditor
            value={content}
            onChange={handleContentChange}
            height="100%"
            preview="edit"
            hideToolbar={false}
            data-color-mode={theme}
            className="!bg-transparent !border-0"
          />
        </div>
      </div>
    </div>
  );
};