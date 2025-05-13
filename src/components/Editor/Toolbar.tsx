import React, { useState } from 'react';
import { useEditor } from '@tiptap/react';
import { useDocument } from '../../context/DocumentContext';
import {
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Link, Image, 
  Code, Quote, Heading1, Heading2, Undo, Redo
} from 'lucide-react';

const Toolbar: React.FC = () => {
  const { editor } = useDocument();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    
    if (showLinkInput) {
      if (linkUrl) {
        editor.chain().focus().setLink({ href: linkUrl }).run();
        setLinkUrl('');
      }
      setShowLinkInput(false);
    } else {
      setShowLinkInput(true);
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const ToolbarButton = ({ onClick, active, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' 
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-3 py-2">
      <div className="flex flex-wrap items-center gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={18} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={18} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
        >
          <Underline size={18} />
        </ToolbarButton>
        
        <span className="mx-1 text-gray-300 dark:text-gray-700">|</span>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 size={18} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={18} />
        </ToolbarButton>
        
        <span className="mx-1 text-gray-300 dark:text-gray-700">|</span>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={18} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        
        <span className="mx-1 text-gray-300 dark:text-gray-700">|</span>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft size={18} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter size={18} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
        >
          <AlignRight size={18} />
        </ToolbarButton>
        
        <span className="mx-1 text-gray-300 dark:text-gray-700">|</span>
        
        <ToolbarButton
          onClick={toggleLink}
          active={editor.isActive('link') || showLinkInput}
        >
          <Link size={18} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={addImage}
        >
          <Image size={18} />
        </ToolbarButton>
        
        <span className="mx-1 text-gray-300 dark:text-gray-700">|</span>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
        >
          <Code size={18} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          <Quote size={18} />
        </ToolbarButton>
        
        <span className="mx-1 text-gray-300 dark:text-gray-700">|</span>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo size={18} />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo size={18} />
        </ToolbarButton>
      </div>
      
      {showLinkInput && (
        <div className="flex items-center mt-2 gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-1 px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                toggleLink();
              }
            }}
          />
          <button 
            onClick={toggleLink}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;