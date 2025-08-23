-- Add pins and tags functionality to notes table
ALTER TABLE public.notes 
ADD COLUMN pinned BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Create index for better performance on pinned notes
CREATE INDEX idx_notes_pinned ON public.notes (pinned, updated_at DESC);

-- Create index for tags array queries
CREATE INDEX idx_notes_tags ON public.notes USING GIN(tags);

-- Update the trigger to ensure updated_at is still working
-- (This is just a verification, the trigger should already exist)