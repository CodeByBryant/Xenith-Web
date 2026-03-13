import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  CheckSquare,
  Heading2,
  Heading3,
  Quote,
  Code,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content?: Record<string, unknown> | null;
  onChange?: (json: Record<string, unknown>) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

type ToolbarButton = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  action: () => void;
  isActive?: () => boolean;
};

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing…",
  editable = true,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Placeholder.configure({ placeholder }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
    ],
    content: content ?? undefined,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON() as Record<string, unknown>);
    },
  });

  if (!editor) return null;

  const toolbarGroups: ToolbarButton[][] = [
    [
      {
        icon: Heading2,
        label: "Heading 2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.isActive("heading", { level: 2 }),
      },
      {
        icon: Heading3,
        label: "Heading 3",
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => editor.isActive("heading", { level: 3 }),
      },
    ],
    [
      {
        icon: Bold,
        label: "Bold",
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: () => editor.isActive("bold"),
      },
      {
        icon: Italic,
        label: "Italic",
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: () => editor.isActive("italic"),
      },
      {
        icon: UnderlineIcon,
        label: "Underline",
        action: () => editor.chain().focus().toggleUnderline().run(),
        isActive: () => editor.isActive("underline"),
      },
      {
        icon: Strikethrough,
        label: "Strikethrough",
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: () => editor.isActive("strike"),
      },
      {
        icon: Code,
        label: "Inline code",
        action: () => editor.chain().focus().toggleCode().run(),
        isActive: () => editor.isActive("code"),
      },
    ],
    [
      {
        icon: List,
        label: "Bullet list",
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: () => editor.isActive("bulletList"),
      },
      {
        icon: ListOrdered,
        label: "Numbered list",
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.isActive("orderedList"),
      },
      {
        icon: CheckSquare,
        label: "Task list",
        action: () => editor.chain().focus().toggleTaskList().run(),
        isActive: () => editor.isActive("taskList"),
      },
    ],
    [
      {
        icon: Quote,
        label: "Blockquote",
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: () => editor.isActive("blockquote"),
      },
      {
        icon: Minus,
        label: "Divider",
        action: () => editor.chain().focus().setHorizontalRule().run(),
        isActive: () => false,
      },
    ],
  ];

  return (
    <div
      className={cn(
        "flex flex-col border border-border rounded-2xl overflow-hidden",
        className,
      )}
    >
      {editable && (
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-secondary/30">
          {toolbarGroups.map((group, gi) => (
            <span key={gi} className="flex items-center gap-0.5">
              {gi > 0 && <span className="w-px h-4 bg-border mx-1" />}
              {group.map(({ icon: Icon, label, action, isActive }) => (
                <button
                  key={label}
                  type="button"
                  title={label}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    action();
                  }}
                  className={cn(
                    "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                    isActive?.() &&
                      "bg-foreground text-background hover:bg-foreground",
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </span>
          ))}
        </div>
      )}
      <EditorContent
        editor={editor}
        className={cn(
          "prose prose-sm dark:prose-invert max-w-none px-4 py-3 min-h-[200px] focus-within:outline-none",
          "[&_.tiptap]:outline-none [&_.tiptap]:min-h-[180px]",
          "[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground",
          "[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_.tiptap_p.is-editor-empty:first-child::before]:float-left",
          "[&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
          "[&_.tiptap_ul[data-type=taskList]]:list-none [&_.tiptap_ul[data-type=taskList]]:pl-0",
          "[&_.tiptap_li[data-type=taskItem]]:flex [&_.tiptap_li[data-type=taskItem]]:items-start [&_.tiptap_li[data-type=taskItem]]:gap-2",
        )}
      />
    </div>
  );
}
