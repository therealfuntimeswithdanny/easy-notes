import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { DraggableNotesList } from './DraggableNotesList';
import { CategoryManager } from './CategoryManager';
import { cn } from '@/lib/utils';

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

interface SidebarProps {
  notes: Note[];
  selectedNote: Note | null;
  selectedCategory: string | null;
  onSelectNote: (note: Note) => void;
  onSelectCategory: (category: string | null) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onReorderNotes: (notes: Note[]) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export const Sidebar = ({ 
  notes, 
  selectedNote, 
  selectedCategory, 
  onSelectNote, 
  onSelectCategory, 
  onDeleteNote, 
  onTogglePin, 
  onReorderNotes, 
  searchInputRef 
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));
  const allCategories = Array.from(new Set(notes.map(note => note.category)));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => note.tags?.includes(tag));
    
    const matchesCategory = selectedCategory === null || note.category === selectedCategory;
    
    return matchesSearch && matchesTags && matchesCategory;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const createCategory = (categoryName: string) => {
    // This will be handled when creating notes with the new category
    onSelectCategory(categoryName);
  };

  return (
    <div className="w-full h-full bg-sidebar-bg border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Notes</h2>
        <p className="text-sm text-muted-foreground">{notes.length} total</p>
      </div>

      {/* Categories */}
      <div className="p-4 border-b">
        <CategoryManager
          categories={allCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          onCreateCategory={createCategory}
        />
      </div>

      {/* Search */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search notes... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Filter by tags:</p>
            <div className="flex flex-wrap gap-1">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="h-6 text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <DraggableNotesList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={onSelectNote}
            onDeleteNote={onDeleteNote}
            onTogglePin={onTogglePin}
            onReorderNotes={onReorderNotes}
          />
        </div>
      </ScrollArea>
    </div>
  );
};