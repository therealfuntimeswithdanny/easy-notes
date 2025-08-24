import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sidebar } from './Sidebar';
import { NoteEditor } from './NoteEditor';
import { ExportDialog } from './ExportDialog';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Menu, Download } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useState as useMobileState } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  tags: string[];
}

export const NotesApp = () => {
  const { user, signOut } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useMobileState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
        .order('pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      if (data && data.length > 0 && !selectedNote) {
        setSelectedNote(data[0]);
      }
    } catch (error: any) {
      toast.error('Failed to conect to Database, notes not loaded');
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
          title: 'Cick to add tittle',
          content: '# New Note\n\nStart writing...',
          pinned: false,
          tags: [],
        })
        .select()
        .single();

      if (error) throw error;
      
      const newNote = data as Note;
      setNotes(prev => [newNote, ...prev]);
      setSelectedNote(newNote);
      toast.success('New note created');
    } catch (error: any) {
      toast.error('Failed to Conect to Databse, note not created');
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
      toast.error('Failed to connect to Database, note not saved');
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
      toast.error('Failed to conect to Database, note not deleted');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  const togglePin = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({ pinned: !note.pinned })
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, pinned: !note.pinned } : note
      ).sort((a, b) => {
        // Sort by pinned first, then by updated_at
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }));
      
      if (selectedNote?.id === noteId) {
        setSelectedNote(prev => prev ? { ...prev, pinned: !prev.pinned } : null);
      }
      
      toast.success(note.pinned ? 'Note unpinned' : 'Note pinned');
    } catch (error: any) {
      toast.error('Failed to conect to Databse');
    }
  };

  const handleReorderNotes = async (reorderedNotes: Note[]) => {
    // Update local state immediately for smooth UX
    setNotes(reorderedNotes);
    
    // You could implement server-side ordering here if needed
    // For now, we'll just update the local state
  };

  const forceSave = () => {
    // This will be handled by the NoteEditor component
    const event = new CustomEvent('forceSave');
    document.dispatchEvent(event);
  };

  const focusSearch = () => {
    searchInputRef.current?.focus();
  };

  const handleDeleteSelected = () => {
    if (selectedNote) {
      deleteNote(selectedNote.id);
    }
  };

  const handleTogglePinSelected = () => {
    if (selectedNote) {
      togglePin(selectedNote.id);
    }
  };

  const handleExportNotes = () => {
    // This will be handled by the ExportDialog component
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewNote: createNote,
    onSave: forceSave,
    onDelete: handleDeleteSelected,
    onSearch: focusSearch,
    onExport: handleExportNotes,
    onTogglePin: handleTogglePinSelected,
  });

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
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={(note) => {
            setSelectedNote(note);
            setSidebarOpen(false); // Close sidebar on mobile when note is selected
          }}
          onDeleteNote={deleteNote}
          onTogglePin={togglePin}
          onReorderNotes={handleReorderNotes}
          searchInputRef={searchInputRef}
        />
      </div>
      
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="border-b bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text">
              Easy Notes
            </h1>
            <Button onClick={createNote} size="sm" className="gap-2 hidden sm:flex">
              <Plus className="h-4 w-4" />
               Create New Note
            </Button>
            <Button onClick={createNote} size="sm" className="sm:hidden">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <ExportDialog notes={notes} selectedNote={selectedNote}>
              <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </ExportDialog>
            <ExportDialog notes={notes} selectedNote={selectedNote}>
              <Button variant="outline" size="sm" className="sm:hidden">
                <Download className="h-4 w-4" />
              </Button>
            </ExportDialog>
            <ThemeToggle />
            <span className="text-sm text-muted-foreground hidden sm:inline">
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