import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { PlusIcon, SearchIcon, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface NotesSidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onSignOut: () => void;
  loading: boolean;
}

const NotesSidebar = ({ 
  notes, 
  selectedNoteId, 
  onSelectNote, 
  onCreateNote, 
  onSignOut,
  loading 
}: NotesSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-80 bg-sidebar-bg border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Notes</h1>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOutIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={onCreateNote}
            className="w-full bg-gradient-primary hover:bg-primary-hover transition-smooth"
            disabled={loading}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Note
          </Button>
          
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-3 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </Card>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery ? "No notes found" : "No notes yet"}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <Card
                key={note.id}
                className={cn(
                  "p-3 cursor-pointer transition-smooth hover:bg-note-hover border-0",
                  selectedNoteId === note.id && "bg-accent shadow-soft"
                )}
                onClick={() => onSelectNote(note)}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-foreground truncate flex-1">
                      {note.title || "Untitled"}
                    </h3>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatDate(note.updated_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {note.content.slice(0, 100) || "No content"}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotesSidebar;