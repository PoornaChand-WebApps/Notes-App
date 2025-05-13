import { Menu } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Menu size={24} />
            </button>
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-gray-800">Clue Notes</h1>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:underline"
          >
            Sign out
          </button> 

          
        </div>
      </div>
    </header>
  );
};

export default Header;