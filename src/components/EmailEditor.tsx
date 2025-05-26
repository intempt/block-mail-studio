
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Eye, Send, Bold, Italic, Underline as UnderlineIcon } from 'lucide-react';
import { EmailPreview } from './EmailPreview';
import { BlockInserter } from './BlockInserter';

export default function EmailEditor() {
  const navigate = useNavigate();
  const [content, setContent] = useState('<p>Start writing your email...</p>');
  const [subject, setSubject] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleBack = () => {
    navigate('/');
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handlePublish = () => {
    console.log('Publishing email:', { subject, content });
    alert('Email published successfully!');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workspace
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Email Editor</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Input
            placeholder="Subject line..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-64"
          />
          <Button onClick={handlePreview} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Add Content</h3>
              <BlockInserter editor={editor} />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Formatting</h3>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={editor?.isActive('bold') ? 'bg-gray-200' : ''}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={editor?.isActive('italic') ? 'bg-gray-200' : ''}
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={editor?.isActive('underline') ? 'bg-gray-200' : ''}
                >
                  <UnderlineIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 overflow-auto p-6">
          <Card className="max-w-2xl mx-auto p-6 min-h-96">
            <EditorContent 
              editor={editor} 
              className="prose max-w-none min-h-80 outline-none"
            />
          </Card>
        </div>

        {/* Right Sidebar - Code View */}
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">HTML Output</h3>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-96">
            {content}
          </pre>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <EmailPreview
          html={content}
          previewMode="desktop"
        />
      )}
    </div>
  );
}
