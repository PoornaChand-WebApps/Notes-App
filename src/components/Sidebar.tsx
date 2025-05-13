import { FileText, Trash2, Edit2, Eye } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useNoteStore } from '../store/noteStore';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { notes, deleteNote, setCurrentNote, loading, hasMore, loadMoreNotes } = useNoteStore();
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !loading && hasMore) {
      loadMoreNotes();
    }
  }, [inView, loading, hasMore]);

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } overflow-y-auto`}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Notes</h2>
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{note.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{note.content}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center text-xs text-gray-500">
                  <FileText size={12} className="mr-1" />
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setCurrentNote({ ...note, mode: 'view' })}
                    className="text-gray-500 hover:text-gray-700"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentNote({ ...note, mode: 'edit' })}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          )}
          <div ref={ref} className="h-4" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;