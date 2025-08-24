import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableNoteItem';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  tags: string[];
}

interface DraggableNotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onReorderNotes: (notes: Note[]) => void;
}

export const DraggableNotesList = ({
  notes,
  selectedNote,
  onSelectNote,
  onDeleteNote,
  onTogglePin,
  onReorderNotes,
}: DraggableNotesListProps) => {
  const [items, setItems] = useState(notes);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update items when notes prop changes
  useEffect(() => {
    setItems(notes);
  }, [notes]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over?.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorderNotes(newItems);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPreview = (content: string) => {
    // Remove markdown formatting for preview
    const preview = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .split('\n')
      .find(line => line.trim() !== '') || '';
    
    return preview.length > 50 ? preview.substring(0, 50) + '...' : preview;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No notes found</p>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((note) => (
            <SortableItem
              key={note.id}
              id={note.id}
              note={note}
              isSelected={selectedNote?.id === note.id}
              onSelect={() => onSelectNote(note)}
              onDelete={() => onDeleteNote(note.id)}
              onTogglePin={() => onTogglePin(note.id)}
              formatDate={formatDate}
              getPreview={getPreview}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};