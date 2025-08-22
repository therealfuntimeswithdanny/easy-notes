import { useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import AuthPage from "@/components/AuthPage";
import NotesApp from "@/components/NotesApp";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const handleAuthSuccess = (user: User, session: Session) => {
    setUser(user);
    setSession(session);
  };

  const handleSignOut = () => {
    setUser(null);
    setSession(null);
  };

  if (!user || !session) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return <NotesApp user={user} session={session} onSignOut={handleSignOut} />;
};

export default Index;
