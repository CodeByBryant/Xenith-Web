import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect, useRef, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link2,
} from "lucide-react";

interface TiptapEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder,
  className,
}: TiptapEditorProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleToolbarMouseDown = (
    event: MouseEvent<HTMLButtonElement>,
    action: () => void,
  ) => {
    event.preventDefault();
    action();
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const snapshot = editor.getJSON() as Record<string, unknown>;
      timeoutRef.current = setTimeout(() => {
        onChangeRef.current(snapshot);
      }, 650);
    },
    editorProps: {
      attributes: {
        class: cn(
          "max-w-none text-base leading-7 text-foreground focus:outline-none",
          "[&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-foreground",
          "[&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-foreground",
          "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:text-foreground",
          "[&_p]:my-2 [&_p]:text-base [&_p]:leading-7 [&_p]:text-foreground",
          "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_li]:text-foreground [&_li::marker]:text-muted-foreground",
          "[&_li>ul]:mt-2 [&_li>ol]:mt-2",
          "[&_strong]:font-semibold [&_strong]:text-foreground",
          "[&_code]:rounded [&_code]:bg-secondary [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-foreground",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
          "[&_a]:text-blue-500 [&_a]:underline",
          "min-h-[400px]",
          className,
        ),
      },
    },
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-secondary/30">
        <button
          type="button"
          onMouseDown={(event) =>
            handleToolbarMouseDown(event, () =>
              editor.chain().focus().toggleHeading({ level: 1 }).run(),
            )
          }
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors",
            editor.isActive("heading", { level: 1 }) && "bg-secondary",
          )}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(event) =>
            handleToolbarMouseDown(event, () =>
              editor.chain().focus().toggleHeading({ level: 2 }).run(),
            )
          }
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors",
            editor.isActive("heading", { level: 2 }) && "bg-secondary",
          )}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(event) =>
            handleToolbarMouseDown(event, () =>
              editor.chain().focus().toggleHeading({ level: 3 }).run(),
            )
          }
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors",
            editor.isActive("heading", { level: 3 }) && "bg-secondary",
          )}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onMouseDown={(event) =>
            handleToolbarMouseDown(event, () =>
              editor.chain().focus().toggleBold().run(),
            )
          }
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors",
            editor.isActive("bold") && "bg-secondary",
          )}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(event) =>
            handleToolbarMouseDown(event, () =>
              editor.chain().focus().toggleItalic().run(),
            )
          }
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors",
            editor.isActive("italic") && "bg-secondary",
          )}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(event) =>
            handleToolbarMouseDown(event, () =>
              editor.chain().focus().toggleCode().run(),
            )
          }
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors",
            editor.isActive("code") && "bg-secondary",
          )}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onMouseDown={(event) =>
            handleToolbarMouseDown(event, () =>
              editor.chain().focus().toggleBulletList().run(),
            )
          }
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors",
            editor.isActive("bulletList") && "bg-secondary",
          )}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(event) =>
            handleToolbarMouseDown(event, () =>
              editor.chain().focus().toggleOrderedList().run(),
            )
          }
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors",
            editor.isActive("orderedList") && "bg-secondary",
          )}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(event) =>
            handleToolbarMouseDown(event, () =>
              editor.chain().focus().toggleBlockquote().run(),
            )
          }
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors",
            editor.isActive("blockquote") && "bg-secondary",
          )}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          type="button"
          onMouseDown={(event) => handleToolbarMouseDown(event, setLink)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary transition-colors",
            editor.isActive("link") && "bg-secondary",
          )}
          title="Add Link"
        >
          <Link2 className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
