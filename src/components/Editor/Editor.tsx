import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange, onFocus, onBlur }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Color,
      Placeholder.configure({
        placeholder: 'Start writing something brilliant…',
        emptyEditorClass: 'editor-placeholder',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => {
      onFocus();
    },
    onBlur: () => {
      onBlur();
    },
  });

  useEffect(() => {
    if (editor && content === '') {
      editor.commands.setContent('');
    }
  }, [editor, content]);

  return (
    <div className="prose prose-lg max-w-none">
      <style jsx>{`
        .ProseMirror {
          min-height: 300px;
          outline: none;
          background-color: white;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .editor-placeholder p::before {
          content: "Start writing something brilliant…";
          color: #9ca3af;
          float: left;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror h1 {
          font-size: 2em;
          margin-bottom: 0.5em;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          margin-bottom: 0.5em;
        }
        .ProseMirror p {
          margin-bottom: 0.5em;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin-bottom: 0.5em;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          margin-left: 0;
          color: #4b5563;
        }
      `}</style>
      <EditorContent editor={editor} className="min-h-[300px]" />
    </div>
  );
};

export default Editor;