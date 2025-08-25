import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Folder, FolderPlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryManagerProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onCreateCategory: (category: string) => void;
  children?: React.ReactNode;
}

export const CategoryManager = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onCreateCategory,
  children 
}: CategoryManagerProps) => {
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleCreateCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onCreateCategory(newCategory.trim());
      setNewCategory('');
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateCategory();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <FolderPlus className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory} disabled={!newCategory.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-1">
        {/* All Notes */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-2 h-8 text-xs font-normal",
            selectedCategory === null && "bg-accent"
          )}
          onClick={() => onSelectCategory(null)}
        >
          <Folder className="h-3 w-3" />
          All Notes
        </Button>

        {/* Categories */}
        {categories.map(category => (
          <div key={category} className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1 justify-start gap-2 h-8 text-xs font-normal",
                selectedCategory === category && "bg-accent"
              )}
              onClick={() => onSelectCategory(category)}
            >
              <Folder className="h-3 w-3" />
              {category}
            </Button>
          </div>
        ))}
      </div>

      {children}
    </div>
  );
};