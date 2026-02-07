'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Link2,
    Undo,
    Redo
} from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-4',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Tulis konten artikel di sini...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const url = window.prompt('Enter URL:');

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const wordCount = editor.state.doc.textContent.length;

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                {/* Text Formatting */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1" />

                {/* Headings */}
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                    title="Heading 2"
                >
                    <Heading1 className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                    title="Heading 3"
                >
                    <Heading2 className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1" />

                {/* Lists */}
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1" />

                {/* Quote */}
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </button>

                {/* Link */}
                <button
                    onClick={setLink}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                    title="Link"
                >
                    <Link2 className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 mx-1" />

                {/* Undo/Redo */}
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    className="p-2 rounded hover:bg-gray-200"
                    type="button"
                    title="Undo"
                    disabled={!editor.can().undo()}
                >
                    <Undo className="w-4 h-4" />
                </button>

                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    className="p-2 rounded hover:bg-gray-200"
                    type="button"
                    title="Redo"
                    disabled={!editor.can().redo()}
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />

            {/* Footer - Word Count */}
            <div className="bg-gray-50 border-t border-gray-300 px-4 py-2">
                <p className="text-xs text-gray-600">
                    {wordCount} karakter
                </p>
            </div>
        </div>
    );
}