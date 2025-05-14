import { useState, useEffect } from 'react';
import { Plus, Save, X, Edit2 } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';
import { supabase } from '../lib/supabase';
import { Editor } from 'primereact/editor';
import "primereact/resources/themes/lara-light-cyan/theme.css";

const NoteEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState<string>('');
  const { addNote, updateNote, currentNote, setCurrentNote } = useNoteStore();

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
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [currentNote]);

  const handleSubmit = async () => {
    if (title.trim() && content.trim()) {
      setSaving(true);
      try {
        if (currentNote) {
          await updateNote(currentNote.id, title, content);
        } else {
          await addNote(title, content);
        }
        setTitle('');
        setContent('');
      } catch (error) {
        console.error('Error saving note:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setCurrentNote(null);
    setTitle('');
    setContent('');
    handleSubmit();
  };

  if (currentNote?.mode === 'view') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{currentNote.title}</h2>
          <div className='flex justify-between'> 
           <button
             onClick={() => setCurrentNote({ ...currentNote, mode: 'edit' })}
            className="text-blue-500 hover:text-blue-700 border p-2 flex text-gray-500 mr-2 hover:text-gray-700"
          >
              <Edit2 className='mt-1 mr-1' size={16} /> Edit 
          </button>
          <button
            onClick={handleCancel}
            className="border p-2 flex  text-red-500 hover:text-red-700"
          >
            <X size={20} /> Close
          </button>           
          </div>

        </div>
          <div
            className="border p-4 bg-gray-100 mt-2"
            dangerouslySetInnerHTML={{ __html: currentNote.content }}
          />
        {currentNote.last_edited_by && (
          <div className="mt-4 text-sm text-gray-500">
            Last edited by: {currentNote.last_edited_by}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="mb-4 text-sm text-gray-500">
          Writing as: {username || 'Guest User'}
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full mb-4 px-4 py-2 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          disabled={saving}
        />
        <div style={{height:'200px'}}> 
          <Editor value={content}  placeholder="Write your note here..." onTextChange={(e) => setContent(e?.htmlValue)} disabled={saving}  style={{ height: '160px' }} />                
        </div>
        
      </div>
      <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between items-center">
        {currentNote ? (
          <>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </>
        ) : (
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={20} className="mr-2" />
                Add Note
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;