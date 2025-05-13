import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  last_edited_by: string;
  version: number;
}

interface NoteStore {
  notes: Note[];
  currentNote: (Note & { mode?: 'view' | 'edit' }) | null;
  loading: boolean;
  hasMore: boolean;
  page: number;
  addNote: (title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setCurrentNote: (note: (Note & { mode?: 'view' | 'edit' }) | null) => void;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  fetchNotes: () => Promise<void>;
  loadMoreNotes: () => Promise<void>;
  handleRealtimeChanges: () => void;
}

const NOTES_PER_PAGE = 10;

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  currentNote: null,
  loading: false,
  hasMore: true,
  page: 1,

  addNote: async (title, content) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const displayName = user.user_metadata.isGuest ? 'Guest User' : (user.user_metadata.username || user.id);

    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        title,
        content,
        user_id: user.id,
        last_edited_by: displayName,
        version: 1,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding note:', error);
      return;
    }

    set((state) => ({
      notes: [note, ...state.notes],
    }));
  },

  deleteNote: async (id) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      return;
    }

    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      currentNote: state.currentNote?.id === id ? null : state.currentNote,
    }));
  },

  setCurrentNote: (note) => set({ currentNote: note }),

  updateNote: async (id, title, content) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const displayName = user.user_metadata.isGuest ? 'Guest User' : (user.user_metadata.username || user.id);

    const { data: currentNote } = await supabase
      .from('notes')
      .select('version')
      .eq('id', id)
      .single();

    if (!currentNote) return;

    const { data: note, error } = await supabase
      .from('notes')
      .update({
        title,
        content,
        last_edited_by: displayName,
        version: currentNote.version + 1,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        alert('This note was modified by someone else. Please refresh and try again.');
        return;
      }
      console.error('Error updating note:', error);
      return;
    }

    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? note : n)),
      currentNote: null,
    }));
  },

  fetchNotes: async () => {
    set({ loading: true });
    
    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
      .range(0, NOTES_PER_PAGE - 1);

    if (error) {
      console.error('Error fetching notes:', error);
      set({ loading: false });
      return;
    }

    set({
      notes,
      loading: false,
      page: 1,
      hasMore: notes.length === NOTES_PER_PAGE,
    });
  },

  loadMoreNotes: async () => {
    const { page, loading, hasMore } = get();
    if (loading || !hasMore) return;

    set({ loading: true });

    const from = page * NOTES_PER_PAGE;
    const to = from + NOTES_PER_PAGE - 1;

    const { data: newNotes, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error loading more notes:', error);
      set({ loading: false });
      return;
    }

    set((state) => ({
      notes: [...state.notes, ...newNotes],
      page: state.page + 1,
      loading: false,
      hasMore: newNotes.length === NOTES_PER_PAGE,
    }));
  },

  handleRealtimeChanges: () => {
    supabase
      .channel('notes_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              set((state) => ({
                notes: [payload.new as Note, ...state.notes],
              }));
              break;
            case 'UPDATE':
              set((state) => ({
                notes: state.notes.map((note) =>
                  note.id === payload.new.id ? (payload.new as Note) : note
                ),
                currentNote: state.currentNote?.id === payload.new.id
                  ? { ...payload.new as Note, mode: state.currentNote.mode }
                  : state.currentNote,
              }));
              break;
            case 'DELETE':
              set((state) => ({
                notes: state.notes.filter((note) => note.id !== payload.old.id),
                currentNote: state.currentNote?.id === payload.old.id ? null : state.currentNote,
              }));
              break;
          }
        }
      )
      .subscribe();
  },
}));