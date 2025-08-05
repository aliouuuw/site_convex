"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Heading } from "@tiptap/extension-heading";
import ImageExtension from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextAlign } from "@tiptap/extension-text-align";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { FontFamily } from "@tiptap/extension-font-family";
import { FontSize } from "@tiptap/extension-font-size";
import { Blockquote } from "@tiptap/extension-blockquote";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { CodeBlock } from "@tiptap/extension-code-block";
import HardBreak from "@tiptap/extension-hard-break";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
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
  FaVideo as VideoIcon,
  FaCode,
  FaHighlighter,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaTable,
  FaFileCode,
  FaMinus,
  FaCheckSquare,
  FaSquare,
  FaSuperscript,
  FaSubscript,
  FaFont,
  FaTextHeight,
  FaPalette,
  FaEye,
  FaEyeSlash,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useState, KeyboardEvent, useRef, ChangeEvent, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ColorPicker } from "@/components/ui/color-picker";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  minHeight?: number;
  showToolbar?: boolean;
  toolbarPosition?: "top" | "bottom";
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
  toolbarPosition = "top",
  maxHeight = 600,
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Prevent selection issues when clicking toolbar/popovers by using pointer-events layering
  // and improving editor options.
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        // Remove duplicate extensions that are already in StarterKit
        link: false,
        underline: false,
        codeBlock: false,
        horizontalRule: false,
        blockquote: false,
        // Keep list-related extensions enabled by not overriding them here (we also add explicit extensions below)
        // bulletList, orderedList, and listItem are enabled by default in StarterKit
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextStyle,
      Color,
      ImageExtension.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg shadow-sm border border-gray-200",
        },
      }),
      // Configure heading separately since we disabled it in StarterKit
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Superscript,
      Subscript,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      HorizontalRule,
      Blockquote,
      CodeBlock.configure({
        HTMLAttributes: {
          class: "rounded-md bg-gray-100 p-4 font-mono text-sm",
        },
      }),
      // Allow explicit line breaks with Shift+Enter and a toolbar button
      HardBreak.configure({
        keepMarks: true,
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "not-prose space-y-1",
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-start gap-2",
        },
        nested: true,
      }),
      // Add explicit list extensions to ensure commands are registered
      BulletList.configure({
        HTMLAttributes: { class: "list-disc pl-6" },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "list-decimal pl-6" },
      }),
      ListItem.configure({
        HTMLAttributes: { class: "mb-1" },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      
      // Update word and character counts
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
    },
    editable,
    // Ensure proper selection handling and fresh content parsing
    parseOptions: { preserveWhitespace: "full" },
    editorProps: {
      attributes: {
        class: "tiptap-content",
        // Make sure user selection works and clicks aren't swallowed
        spellcheck: "true",
        role: "textbox",
        "aria-multiline": "true",
      },
      handleDOMEvents: {
        // Fix selection loss when clicking inside content or after using toolbar/popovers
        mousedown: (_view, _event) => {
          // Let the default behavior handle text selection
          return false;
        },
        touchstart: (_view, _event) => false,
        // Preserve native selection behavior across WebKit/Safari and IMEs
        beforeinput: (_view, _event) => false,
        // Make sure the editor regains focus before keyboard shortcuts / commands run
        focus: (_view, _event) => false,
        blur: (_view, _event) => false,
      },
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  // Update counts when content changes
  useEffect(() => {
    if (editor) {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const LinkBubbleMenu = () => {
    const [url, setUrl] = useState("");
    const [showInput, setShowInput] = useState(false);

    const setLink = () => {
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
        setUrl("");
        setShowInput(false);
      }
    };

    const removeLink = () => {
      editor.chain().focus().unsetLink().run();
      setShowInput(false);
    };

    const isLink = editor.isActive("link");

    return (
      <Popover open={showInput} onOpenChange={setShowInput}>
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
        <PopoverContent side="bottom" align="start" className="w-80 p-3 z-[60] bg-white border shadow-md">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                placeholder="Enter URL"
                className="flex-1"
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") setLink();
                  if (e.key === "Escape") setShowInput(false);
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

  const ImageUploadMenu = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Convert file to base64 or URL for demo purposes
      // In a real app, you'd upload to a service and get a URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        editor.chain().focus().setImage({ 
          src: url,
          alt: file.name
        }).run();
      };
      reader.readAsDataURL(file);
    };

    const triggerFileSelect = () => {
      fileInputRef.current?.click();
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
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0 transition-colors hover:bg-gray-100">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" className="w-64 p-3 z-[60] bg-white border shadow-md">
            <div className="space-y-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={triggerFileSelect}
                className="w-full"
              >
                Upload Image
              </Button>
              <div className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF, WebP
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </>
    );
  };

  const VideoUploadMenu = () => {
    const [url, setUrl] = useState("");
    const [showInput, setShowInput] = useState(false);

    const insertVideo = () => {
      if (url) {
        // Create a simple video element using HTML5 video tag
        const videoHtml = `
          <div class="video-container">
            <video controls class="max-w-full h-auto rounded-lg shadow-sm border border-gray-200">
              <source src="${url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        `;
        editor.chain().focus().insertContent(videoHtml).run();
        setUrl("");
        setShowInput(false);
      }
    };

    const removeVideo = () => {
      // Find and remove video elements
      const videoElements = editor.view.dom.querySelectorAll('.video-container');
      videoElements.forEach(video => {
        const range = document.createRange();
        range.selectNode(video);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        editor.commands.deleteSelection();
      });
    };

    const isVideo = editor.view.dom.querySelector('.video-container') !== null;

    return (
      <Popover open={showInput} onOpenChange={setShowInput}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant={isVideo ? "default" : "ghost"}
            className="h-8 w-8 p-0 transition-colors hover:bg-gray-100"
          >
            <VideoIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="w-80 p-3 z-[60] bg-white border shadow-md">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                placeholder="Enter video URL"
                className="flex-1"
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") insertVideo();
                  if (e.key === "Escape") setShowInput(false);
                }}
              />
              <Button type="button" size="sm" onClick={insertVideo}>
                Add
              </Button>
            </div>
            {isVideo && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={removeVideo}
                className="w-full"
              >
                <FaTrash className="h-4 w-4 mr-2" />
                Remove Video
              </Button>
            )}
            <div className="text-xs text-gray-500">
              Supported formats: MP4, WebM
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const ColorMenu = () => {
    const [showPicker, setShowPicker] = useState(false);

    return (
      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0">
            <FaHighlighter className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="w-64 p-3 z-[60] bg-white border shadow-md">
          <ColorPicker
            onColorSelect={(color: string) => {
              if (color) {
                editor.chain().focus().setColor(color).run();
              }
            }}
          />
        </PopoverContent>
      </Popover>
    );
  };

  // Helper to ensure editor has focus with selection preserved before running a command.
  const focusPreserveSelection = () => {
    // TipTap's focus with preventScroll avoids scroll jumps; we also ensure selection isn't collapsed.
    editor.chain().focus(undefined, { scrollIntoView: false }).run();
  };

  const onToolbarCommand = (fn: () => void) => {
    // If editor lost focus due to clicking toolbar, restore focus first.
    // Use requestAnimationFrame to ensure the browser processes the button focus first,
    // then we re-focus the editor and apply the command preserving the selection.
    requestAnimationFrame(() => {
      focusPreserveSelection();
      fn();
    });
  };

  const FormatBar = () => (
    <div className="relative z-[50] flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white p-2">
      {/* Undo/Redo */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onToolbarCommand(() => editor.chain().undo().run())}
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
        onClick={() => onToolbarCommand(() => editor.chain().redo().run())}
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
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleBold().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("bold") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Bold"
        aria-label="Bold"
      >
        <FaBold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleItalic().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("italic") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Italic"
        aria-label="Italic"
      >
        <FaItalic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleUnderline().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("underline") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Underline"
        aria-label="Underline"
      >
        <FaUnderline className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Headings */}
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onMouseDown={(e) => e.preventDefault()}
              className={`h-8 w-8 p-0 ${editor.isActive("heading", { level: 1 }) || editor.isActive("heading", { level: 2 }) || editor.isActive("heading", { level: 3 }) || editor.isActive("heading", { level: 4 }) || editor.isActive("heading", { level: 5 }) || editor.isActive("heading", { level: 6 }) ? "bg-primary text-white" : ""}`}
              title="Heading"
              aria-label="Heading level"
            >
              <FaHeading className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            className="w-56 p-2 z-[60] bg-white border shadow-md"
          >
            <div className="grid grid-cols-1">
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <button
                  key={level}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onToolbarCommand(() => editor.chain().toggleHeading({ level: level as any }).run())}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors hover:bg-gray-100 active:bg-gray-200 ${editor.isActive("heading", { level }) ? "bg-primary text-white hover:bg-primary" : "text-gray-800"}`}
                >
                  <span className="inline-block w-8 font-bold">{`H${level}`}</span>
                  <span className={`truncate ${level === 1 ? "text-xl" : level === 2 ? "text-lg" : level === 3 ? "text-base" : "text-sm"}`}>Heading {level}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Alignment */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().setTextAlign("left").run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive({ textAlign: "left" }) ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Align Left"
        aria-label="Align Left"
      >
        <FaAlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().setTextAlign("center").run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive({ textAlign: "center" }) ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Align Center"
        aria-label="Align Center"
      >
        <FaAlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().setTextAlign("right").run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive({ textAlign: "right" }) ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Align Right"
        aria-label="Align Right"
      >
        <FaAlignRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().setTextAlign("justify").run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive({ textAlign: "justify" }) ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Justify"
        aria-label="Justify"
      >
        <FaAlignJustify className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Lists */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleBulletList().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("bulletList") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Bullet List"
        aria-label="Bullet List"
      >
        <FaListUl className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleOrderedList().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("orderedList") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Numbered List"
        aria-label="Numbered List"
      >
        <FaListOl className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleTaskList().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("taskList") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Task List"
        aria-label="Task List"
      >
        <FaCheckSquare className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Block Elements */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleBlockquote().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("blockquote") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Blockquote"
        aria-label="Blockquote"
      >
        <FaQuoteLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().setHorizontalRule().run())}
        className="h-8 w-8 p-0 transition-colors hover:bg-gray-100"
        title="Horizontal Rule"
        aria-label="Horizontal Rule"
      >
        <FaMinus className="h-4 w-4" />
      </Button>
      {/* Line Break (Hard Break) - Shift+Enter also works */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().setHardBreak().run())}
        className="h-8 w-8 p-0 transition-colors hover:bg-gray-100"
        title="Line Break"
        aria-label="Line Break"
      >
        {/* reuse minus icon to keep icon set stable; could switch to a different glyph if desired */}
        <FaMinus className="h-4 w-4 rotate-90" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Media */}
      <ImageUploadMenu />
      <VideoUploadMenu />
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Links */}
      <LinkBubbleMenu />
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Color */}
      <ColorMenu />
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Code */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleCode().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("code") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Code"
        aria-label="Code"
      >
        <FaCode className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleCodeBlock().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("codeBlock") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Code Block"
        aria-label="Code Block"
      >
        <FaFileCode className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Typography */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleSuperscript().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("superscript") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Superscript"
        aria-label="Superscript"
      >
        <FaSuperscript className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onToolbarCommand(() => editor.chain().toggleSubscript().run())}
        className={`h-8 w-8 p-0 transition-colors hover:bg-gray-100 ${editor.isActive("subscript") ? "bg-primary text-white hover:bg-primary" : ""}`}
        title="Subscript"
        aria-label="Subscript"
      >
        <FaSubscript className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Table */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 transition-colors hover:bg-gray-100"
        onClick={() => {
          const rows = 3;
          const cols = 3;
          const table = Array(rows).fill(null).map(() => 
            Array(cols).fill(null).map(() => '<td class="border border-gray-300 p-2"></td>').join('')
          ).map(row => `<tr>${row}</tr>`).join('');
          editor.chain().focus().insertContent(`<table class="border-collapse border border-gray-300"><tbody>${table}</tbody></table>`).run();
        }}
        title="Insert Table"
      >
        <FaTable className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      {/* Fullscreen */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onToolbarCommand(() => setIsFullscreen(!isFullscreen))}
        className="h-8 w-8 p-0 transition-colors hover:bg-gray-100"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? <FaCompress className="h-4 w-4" /> : <FaExpand className="h-4 w-4" />}
      </Button>
    </div>
  );

  const EditorContainer = ({ children }: { children: React.ReactNode }) => (
    <div className={cn(
      "relative bg-white border border-gray-200 rounded-lg",
      isFocused && "ring-2 ring-primary ring-offset-2",
      isFullscreen ? "fixed inset-0 z-50 m-0 rounded-none overflow-visible" : "rounded-lg overflow-clip"
    )}>
      {showToolbar && toolbarPosition === "top" && <FormatBar />}
      {children}
      {showToolbar && toolbarPosition === "bottom" && <FormatBar />}
      
      {/* Status Bar: pointer-events-none to not block text selection; fixed height to keep content above */}
      <div className="absolute bottom-0 left-0 right-0 z-[20] bg-gray-50 border-t border-gray-200 px-3 h-10 text-xs text-gray-500 flex justify-between items-center pointer-events-none select-none">
        <div className="flex gap-4 pointer-events-auto select-none">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto select-none">
          <span className="flex items-center gap-1">
            <FaEye className="h-3 w-3" />
            {editable ? "Editable" : "Read-only"}
          </span>
        </div>
      </div>
      
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-2 right-2 z-[70] bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          title="Exit Fullscreen"
          aria-label="Exit Fullscreen"
        >
          <FaCompress className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className={className}>
      <EditorContainer>
        {/* Force visible selection highlight inside the ProseMirror content */}
        <style>
          {`
          .tiptap-content .ProseMirror::selection { background: rgba(59, 130, 246, 0.25); color: inherit; }
          .tiptap-content .ProseMirror *::selection { background: rgba(59, 130, 246, 0.25); color: inherit; }
          .tiptap-content .ProseMirror ::-moz-selection { background: rgba(59, 130, 246, 0.25); color: inherit; }
          `}
        </style>
        <EditorContent
          editor={editor}
          className="p-4 pb-14 overflow-y-auto focus:outline-none prose prose-sm max-w-none cursor-text [&>*]:mb-0 [&>p]:mb-4 [&>h1]:mb-6 [&>h2]:mb-5 [&>h3]:mb-4 [&>h4]:mb-3 [&>h5]:mb-2 [&>h6]:mb-1 [&>ul]:mb-4 [&>ol]:mb-4 [&>blockquote]:mb-4 [&>pre]:mb-4 [&>table]:mb-4 [&>img]:mb-4 [&>video]:mb-4 [&>hr]:mb-4 [&>figure]:mb-4 [&>div]:mb-0"
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            WebkitUserSelect: "text",
            userSelect: "text"
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </EditorContainer>
    </div>
  );
}
