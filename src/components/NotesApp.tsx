import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import NotesSidebar from "./NotesSidebar";
import MarkdownEditor from "./MarkdownEditor";
import { User, Session } from '@supabase/supabase-js';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface NotesAppProps {
  user: User;
  session: Session;
  onSignOut: () => void;
}

const NotesApp = ({ user, session, onSignOut }: NotesAppProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

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
      toast({
        title: "Error fetching notes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: 'Untitled',
          content: '',
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newNote = data as Note;
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      
      toast({
        title: "Note created",
        description: "A new note has been created.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', id);

      if (error) throw error;

      const updatedNotes = notes.map(note => 
        note.id === id 
          ? { ...note, title, content, updated_at: new Date().toISOString() }
          : note
      );
      
      setNotes(updatedNotes);
      if (selectedNote?.id === id) {
        setSelectedNote({ ...selectedNote, title, content, updated_at: new Date().toISOString() });
      }

      toast({
        title: "Note saved",
        description: "Your changes have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const remainingNotes = notes.filter(note => note.id !== id);
      setNotes(remainingNotes);
      
      if (selectedNote?.id === id) {
        setSelectedNote(remainingNotes[0] || null);
      }

      toast({
        title: "Note deleted",
        description: "The note has been deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  return (
    <div className="flex h-screen bg-background">
      <NotesSidebar
        notes={notes}
        selectedNoteId={selectedNote?.id || null}
        onSelectNote={setSelectedNote}
        onCreateNote={createNote}
        onSignOut={handleSignOut}
        loading={loading}
      />
      <MarkdownEditor
        note={selectedNote}
        onUpdateNote={updateNote}
        onDeleteNote={deleteNote}
        loading={loading}
      />
    </div>
  );
};

export default NotesApp;