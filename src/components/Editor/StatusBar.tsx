import React from 'react';
import { Clock } from 'lucide-react';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ wordCount, charCount }) => {
  // Estimate reading time: average reading speed is ~200-250 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 225));
  
  return (
    <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span>{wordCount} words</span>
        <span>•</span>
        <span>{charCount} characters</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock size={14} />
        <span>{readingTimeMinutes} min read</span>
      </div>
    </div>
  );
};

export default StatusBar;