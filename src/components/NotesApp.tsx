import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sidebar } from './Sidebar';
import { NoteEditor } from './NoteEditor';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const NotesApp = () => {
  const { user, signOut } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      if (data && data.length > 0 && !selectedNote) {
        setSelectedNote(data[0]);
      }
    } catch (error: any) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: 'Untitled',
          content: '# New Note\n\nStart writing...',
        })
        .select()
        .single();

      if (error) throw error;
      
      const newNote = data as Note;
      setNotes(prev => [newNote, ...prev]);
      setSelectedNote(newNote);
      toast.success('New note created');
    } catch (error: any) {
      toast.error('Failed to create note');
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, ...updates } : note
      ));
      
      if (selectedNote?.id === noteId) {
        setSelectedNote(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error: any) {
      toast.error('Failed to save note');
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      if (selectedNote?.id === noteId) {
        const remainingNotes = notes.filter(note => note.id !== noteId);
        setSelectedNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
      }
      
      toast.success('Note deleted');
    } catch (error: any) {
      toast.error('Failed to delete note');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground">Loading your notes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar
        notes={notes}
        selectedNote={selectedNote}
        onSelectNote={setSelectedNote}
        onDeleteNote={deleteNote}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
              QuillPad Notes
            </h1>
            <Button onClick={createNote} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Editor */}
        <div className="flex-1">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdateNote={updateNote}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-editor-bg">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                  No notes yet
                </h2>
                <p className="text-muted-foreground mb-4">
                  Create your first note to get started
                </p>
                <Button onClick={createNote} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};