"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import ImageExtension from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { Button } from "@/components/ui/button";
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaLink as LinkIcon,
  FaUnderline,
  FaTrash,
  FaHeading,
  FaImage as ImageIcon,
  FaCode,
  FaHighlighter,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaMinus,
  FaCheckSquare,
  FaSuperscript,
  FaSubscript,
  FaEye,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useState, useRef, useCallback, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { sanitizeRichText } from "../../shared/contentSanitizer";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  minHeight?: number;
  showToolbar?: boolean;
  maxHeight?: number;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your content...",
  className = "",
  editable = true,
  minHeight = 300,
  showToolbar = true,
  maxHeight = 600,
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Underline,
      TextStyle,
      Color,
      ImageExtension.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg shadow-sm border border-gray-200",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Superscript,
      Subscript,
    ],
    content: content || "",
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();

      // Sanitize: if only empty/whitespace HTML with no media, emit empty string
      const sanitized = sanitizeRichText(html, text);

      onChange(sanitized);
      
      // Update word and character counts
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
        spellcheck: "true",
      },
    },
  });

  // Initialize content and counts when editor is ready
  useEffect(() => {
    if (editor && !isInitialized) {
      setIsInitialized(true);
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
    }
  }, [editor, isInitialized]);

  // Update editor content when content prop changes (but avoid infinite loops)
  useEffect(() => {
    if (editor && isInitialized && content !== editor.getHTML()) {
      const { from, to } = editor.state.selection;
      editor.commands.setContent(content || "", { emitUpdate: false });
      // Restore cursor position if possible
      if (from === to && from <= editor.state.doc.content.size) {
        editor.commands.setTextSelection(from);
      }
    }
  }, [content, editor, isInitialized]);

  const executeCommand = useCallback((command: () => void) => {
    if (!editor) return;
    command();
    editor.commands.focus();
  }, [editor]);

  if (!editor) {
    return (
      <div className={cn("border border-gray-200 rounded-lg p-4", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const LinkMenu = () => {
    const [url, setUrl] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const setLink = () => {
      if (url) {
        executeCommand(() => {
          editor.chain().focus().setLink({ href: url }).run();
        });
        setUrl("");
        setIsOpen(false);
      }
    };

    const removeLink = () => {
      executeCommand(() => {
        editor.chain().focus().unsetLink().run();
      });
      setIsOpen(false);
    };

    const isLink = editor.isActive("link");

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant={isLink ? "default" : "ghost"}
            className="h-8 w-8 p-0"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="w-80 p-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setLink();
                  }
                  if (e.key === "Escape") {
                    setIsOpen(false);
                  }
                }}
              />
              <Button type="button" size="sm" onClick={setLink}>
                Add
              </Button>
            </div>
            {isLink && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={removeLink}
                className="w-full"
              >
                <FaTrash className="h-4 w-4 mr-2" />
                Remove Link
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const ImageMenu = () => {
    const [url, setUrl] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const insertImage = () => {
      if (url) {
        executeCommand(() => {
          editor.chain().focus().setImage({ src: url }).run();
        });
        setUrl("");
        setIsOpen(false);
      }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        executeCommand(() => {
          editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        });
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    };

    return (
      <>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" className="w-64 p-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Image URL"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      insertImage();
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={insertImage}>
                  Add
                </Button>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Upload Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    );
  };

  const ColorMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const colors = [
      "#000000", "#374151", "#6B7280", "#9CA3AF",
      "#EF4444", "#F97316", "#EAB308", "#22C55E",
      "#3B82F6", "#8B5CF6", "#EC4899", "#F43F5E"
    ];

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0">
            <FaHighlighter className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="w-48 p-3">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className="w-8 h-8 rounded border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => {
                  executeCommand(() => {
                    editor.chain().focus().setColor(color).run();
                  });
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const Toolbar = () => (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white p-2">
      {/* Undo/Redo */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().undo().run())}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
        title="Undo"
      >
        <FaUndo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().redo().run())}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
        title="Redo"
      >
        <FaRedo className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Text Formatting */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().toggleBold().run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("bold") && "bg-primary text-white"
        )}
        title="Bold"
      >
        <FaBold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().toggleItalic().run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("italic") && "bg-primary text-white"
        )}
        title="Italic"
      >
        <FaItalic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().toggleUnderline().run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("underline") && "bg-primary text-white"
        )}
        title="Underline"
      >
        <FaUnderline className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Headings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              (editor.isActive("heading", { level: 1 }) ||
                editor.isActive("heading", { level: 2 }) ||
                editor.isActive("heading", { level: 3 })) && "bg-primary text-white"
            )}
            title="Heading"
          >
            <FaHeading className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="w-48 p-2">
          <div className="space-y-1">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => executeCommand(() => 
                  editor.chain().toggleHeading({ level: level as any }).run()
                )}
                className={cn(
                  "w-full text-left px-2 py-1 rounded hover:bg-gray-100",
                  editor.isActive("heading", { level }) && "bg-primary text-white"
                )}
              >
                <span className={cn(
                  "font-bold",
                  level === 1 && "text-xl",
                  level === 2 && "text-lg",
                  level === 3 && "text-base",
                  level >= 4 && "text-sm"
                )}>
                  Heading {level}
                </span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Alignment */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().setTextAlign("left").run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "left" }) && "bg-primary text-white"
        )}
        title="Align Left"
      >
        <FaAlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().setTextAlign("center").run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "center" }) && "bg-primary text-white"
        )}
        title="Align Center"
      >
        <FaAlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().setTextAlign("right").run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "right" }) && "bg-primary text-white"
        )}
        title="Align Right"
      >
        <FaAlignRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().setTextAlign("justify").run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive({ textAlign: "justify" }) && "bg-primary text-white"
        )}
        title="Justify"
      >
        <FaAlignJustify className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().toggleBulletList().run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("bulletList") && "bg-primary text-white"
        )}
        title="Bullet List"
      >
        <FaListUl className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().toggleOrderedList().run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("orderedList") && "bg-primary text-white"
        )}
        title="Numbered List"
      >
        <FaListOl className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().toggleTaskList().run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("taskList") && "bg-primary text-white"
        )}
        title="Task List"
      >
        <FaCheckSquare className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Block Elements */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().toggleBlockquote().run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("blockquote") && "bg-primary text-white"
        )}
        title="Blockquote"
      >
        <FaQuoteLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().setHorizontalRule().run())}
        className="h-8 w-8 p-0"
        title="Horizontal Rule"
      >
        <FaMinus className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Media & Links */}
      <ImageMenu />
      <LinkMenu />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Color */}
      <ColorMenu />

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Code */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().toggleCode().run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("code") && "bg-primary text-white"
        )}
        title="Code"
      >
        <FaCode className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Typography */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().toggleSuperscript().run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("superscript") && "bg-primary text-white"
        )}
        title="Superscript"
      >
        <FaSuperscript className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(() => editor.chain().toggleSubscript().run())}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("subscript") && "bg-primary text-white"
        )}
        title="Subscript"
      >
        <FaSubscript className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className={className}>
      <div className={cn(
        "relative bg-white border border-gray-200 rounded-lg overflow-hidden",
        isFocused && "ring-2 ring-primary ring-offset-2"
      )}>
        {showToolbar && <Toolbar />}
        
        <EditorContent
          editor={editor}
          className="p-4 pb-12 overflow-y-auto focus:outline-none"
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
          }}
        />
        
        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-3 py-2 text-xs text-gray-500 flex justify-between items-center">
          <div className="flex gap-4">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
          <div className="flex items-center gap-1">
            <FaEye className="h-3 w-3" />
            <span>{editable ? "Editable" : "Read-only"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}