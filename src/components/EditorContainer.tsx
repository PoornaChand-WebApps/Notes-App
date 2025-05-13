import React, { useState } from 'react';
import Editor from './Editor/Editor';
import Toolbar from './Editor/Toolbar';
import StatusBar from './Editor/StatusBar';

interface EditorContainerProps {
  onSave: (content: string) => void;
  initialContent: string;
}

const EditorContainer: React.FC<EditorContainerProps> = ({ onSave, initialContent }) => {
  const [content, setContent] = useState(initialContent);
  const [isFocused, setIsFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onSave(newContent);
    
    // Calculate word and character counts
    const text = newContent.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(word => word !== '');
    setWordCount(words.length);
    setCharCount(text.length);
  };

  return (
    <div className="bg-white rounded-lg">
      <div 
        className={`transition-all duration-300 ${
          isFocused ? 'ring-2 ring-blue-500/20' : ''
        }`}
      >
        <Toolbar />
        <div className="p-4">
          <Editor 
            content={content}
            onChange={handleContentChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <StatusBar wordCount={wordCount} charCount={charCount} />
      </div>
    </div>
  );
};

export default EditorContainer;