import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Heading3,
    Quote,
    Undo,
    Redo,
} from 'lucide-react';

interface Props {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function WysiwygEditor({ content, onChange, placeholder }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
        ],
        content: content || '',
        editorProps: {
            attributes: {
                class: 'min-h-[160px] p-4 focus:outline-none text-sm text-gray-800 prose prose-sm max-w-none leading-relaxed',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Avoid resetting cursor if content is basically the same
            if (content === '' && editor.isEmpty) return;
            if (!editor.isFocused) {
                editor.commands.setContent(content || '');
            }
        }
    }, [content, editor]);

    if (!editor) {
        return (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 min-h-[160px] flex items-center justify-center text-xs text-gray-400">
                Memuat editor teks...
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-[#EB2629] focus-within:ring-2 focus-within:ring-[#EB2629]/20 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50/90 border-b border-gray-200 text-gray-600">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200/80 transition-colors ${
                        editor.isActive('bold') ? 'bg-[#EB2629]/10 text-[#EB2629]' : ''
                    }`}
                    title="Tebal (Bold)"
                >
                    <Bold className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200/80 transition-colors ${
                        editor.isActive('italic') ? 'bg-[#EB2629]/10 text-[#EB2629]' : ''
                    }`}
                    title="Miring (Italic)"
                >
                    <Italic className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200/80 transition-colors ${
                        editor.isActive('heading', { level: 2 }) ? 'bg-[#EB2629]/10 text-[#EB2629]' : ''
                    }`}
                    title="Judul Bagian (H2)"
                >
                    <Heading2 className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200/80 transition-colors ${
                        editor.isActive('heading', { level: 3 }) ? 'bg-[#EB2629]/10 text-[#EB2629]' : ''
                    }`}
                    title="Sub-judul (H3)"
                >
                    <Heading3 className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200/80 transition-colors ${
                        editor.isActive('bulletList') ? 'bg-[#EB2629]/10 text-[#EB2629]' : ''
                    }`}
                    title="Daftar Poin (Bullet List)"
                >
                    <List className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200/80 transition-colors ${
                        editor.isActive('orderedList') ? 'bg-[#EB2629]/10 text-[#EB2629]' : ''
                    }`}
                    title="Daftar Angka (Numbered List)"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200/80 transition-colors ${
                        editor.isActive('blockquote') ? 'bg-[#EB2629]/10 text-[#EB2629]' : ''
                    }`}
                    title="Kutipan (Quote)"
                >
                    <Quote className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="p-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200/80 transition-colors disabled:opacity-30"
                    title="Urungkan (Undo)"
                >
                    <Undo className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="p-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200/80 transition-colors disabled:opacity-30"
                    title="Ulangi (Redo)"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            {/* Content Area */}
            <EditorContent editor={editor} />
        </div>
    );
}
