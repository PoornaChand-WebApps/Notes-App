import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import { useNoteStore } from './store/noteStore';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [session, setSession] = useState(null);
  const { fetchNotes, handleRealtimeChanges } = useNoteStore();
  const [username, setUsername] = useState<string>('');

    useEffect(() => {
    const getUsername = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.isGuest) {
        setUsername('Guest User');
      } else if (user?.user_metadata?.username) {
        setUsername(user.user_metadata.username);
      }
    };
    getUsername();
  }, []);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchNotes();
      handleRealtimeChanges();
    }
  }, [session]);

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="max-w-3xl mx-auto">
            <NoteEditor />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App