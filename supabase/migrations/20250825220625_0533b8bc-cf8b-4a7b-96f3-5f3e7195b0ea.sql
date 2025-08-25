-- Add category field to notes table
ALTER TABLE public.notes 
ADD COLUMN category TEXT DEFAULT 'General';