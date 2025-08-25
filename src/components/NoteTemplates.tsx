import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Briefcase, ListTodo, BookOpen, Coffee } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  content: string;
  category: string;
}

interface NoteTemplatesProps {
  onSelectTemplate: (template: Template) => void;
  children: React.ReactNode;
}

const templates: Template[] = [
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Structured format for meeting documentation',
    icon: <Briefcase className="h-4 w-4" />,
    category: 'Work',
    content: `# Meeting Notes - [Date]

## Attendees
- 

## Agenda
- 

## Discussion Points
- 

## Action Items
- [ ] 
- [ ] 

## Next Steps
- 

## Follow-up Date
- `
  },
  {
    id: 'daily',
    name: 'Daily Journal',
    description: 'Reflect on your day',
    icon: <Calendar className="h-4 w-4" />,
    category: 'Personal',
    content: `# Daily Journal - [Date]

## How I'm Feeling
- 

## Today's Highlights
- 
- 
- 

## Challenges Faced
- 

## Lessons Learned
- 

## Tomorrow's Priorities
- [ ] 
- [ ] 
- [ ] 

## Gratitude
- `
  },
  {
    id: 'project',
    name: 'Project Planning',
    description: 'Organize and plan your projects',
    icon: <ListTodo className="h-4 w-4" />,
    category: 'Work',
    content: `# Project: [Project Name]

## Objective
- 

## Scope
### In Scope
- 

### Out of Scope
- 

## Timeline
- **Start Date:** 
- **End Date:** 
- **Key Milestones:** 

## Resources Needed
- 

## Success Criteria
- 

## Risks & Mitigation
- 

## Next Actions
- [ ] 
- [ ] `
  },
  {
    id: 'reading',
    name: 'Reading Notes',
    description: 'Capture insights from books and articles',
    icon: <BookOpen className="h-4 w-4" />,
    category: 'Learning',
    content: `# Reading Notes: [Title]

**Author:** 
**Date Read:** 
**Rating:** ⭐⭐⭐⭐⭐

## Key Takeaways
- 
- 
- 

## Important Quotes
> "Quote here"

## Personal Reflections
- 

## Action Items
- [ ] 
- [ ] 

## Related Topics to Explore
- `
  },
  {
    id: 'idea',
    name: 'Idea Capture',
    description: 'Quick capture for creative ideas',
    icon: <Coffee className="h-4 w-4" />,
    category: 'Creative',
    content: `# Idea: [Idea Title]

## The Concept
- 

## Why This Matters
- 

## Potential Applications
- 
- 
- 

## Next Steps to Explore
- [ ] 
- [ ] 

## Resources Needed
- 

## Related Ideas
- `
  },
  {
    id: 'blank',
    name: 'Blank Note',
    description: 'Start with a clean slate',
    icon: <FileText className="h-4 w-4" />,
    category: 'General',
    content: `# New Note

Start writing...`
  }
];

export const NoteTemplates = ({ onSelectTemplate, children }: NoteTemplatesProps) => {
  const [open, setOpen] = useState(false);

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template);
    setOpen(false);
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="font-medium text-sm text-muted-foreground mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates
                  .filter(template => template.category === category)
                  .map(template => (
                    <Card 
                      key={template.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          {template.icon}
                          {template.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-xs">
                          {template.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};