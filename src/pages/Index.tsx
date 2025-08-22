import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { NotesApp } from '@/components/NotesApp';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            QuillPad Notes
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your minimal markdown note-taking companion. Write, organize, and sync your thoughts seamlessly.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="w-full sm:w-auto"
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  return <NotesApp />;
};

export default Index;