import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import DOMPurify from 'dompurify';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (sanitizedHtml: string) => void;
  placeholder?: string;
  className?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  className = '',
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: DOMPurify.sanitize(content || ''),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const cleanHtml = DOMPurify.sanitize(html);
      onChange(cleanHtml);
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[160px] p-3.5 text-xs text-theme-text focus:outline-none prose prose-invert prose-sm max-w-none leading-relaxed',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className={`rounded-xl border border-theme-border bg-theme-surface shadow-inner overflow-hidden font-sans ${className}`}>
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-theme-border bg-theme-surface-elevated/80 p-1.5 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-1.5 text-xs transition-colors ${
            editor.isActive('bold')
              ? 'bg-theme-primary text-black font-bold'
              : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
          }`}
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-1.5 text-xs transition-colors ${
            editor.isActive('italic')
              ? 'bg-theme-primary text-black font-bold'
              : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
          }`}
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-theme-border mx-0.5" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`rounded p-1.5 text-xs transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-theme-primary text-black font-bold'
              : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
          }`}
          title="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded p-1.5 text-xs transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-theme-primary text-black font-bold'
              : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
          }`}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded p-1.5 text-xs transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-theme-primary text-black font-bold'
              : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
          }`}
          title="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-theme-border mx-0.5" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-1.5 text-xs transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-theme-primary text-black font-bold'
              : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
          }`}
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-1.5 text-xs transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-theme-primary text-black font-bold'
              : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded p-1.5 text-xs transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-theme-primary text-black font-bold'
              : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
          }`}
          title="Quote"
        >
          <Quote className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`rounded p-1.5 text-xs transition-colors ${
            editor.isActive('code')
              ? 'bg-theme-primary text-black font-bold'
              : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
          }`}
          title="Code"
        >
          <Code className="h-3.5 w-3.5" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="rounded p-1.5 text-theme-text-muted hover:bg-theme-surface hover:text-theme-text disabled:opacity-30"
            title="Undo"
          >
            <Undo className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="rounded p-1.5 text-theme-text-muted hover:bg-theme-surface hover:text-theme-text disabled:opacity-30"
            title="Redo"
          >
            <Redo className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};
