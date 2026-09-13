"use client"

import { useState, type ReactNode } from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import CharacterCount from "@tiptap/extension-character-count"
import { Bold, Italic, List, ListOrdered } from "lucide-react"

import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  maxLength?: number
  className?: string
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        active && "bg-accent text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  return (
    <div className="flex items-center gap-1 border-b border-input px-2 py-1.5">
      <ToolbarButton
        label="Fett"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Kursiv"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <div className="mx-1 h-4 w-px bg-border" />
      <ToolbarButton
        label="Aufzählungsliste"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Nummerierte Liste"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
    </div>
  )
}

export function RichTextEditor({ value, onChange, placeholder, maxLength, className }: RichTextEditorProps) {
  const [isEmpty, setIsEmpty] = useState(true)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        code: false,
      }),
      CharacterCount.configure({ limit: maxLength }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-24 px-3 py-2 text-sm outline-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_p]:my-1",
      },
    },
    onCreate: ({ editor }) => setIsEmpty(editor.isEmpty),
    onUpdate: ({ editor }) => {
      setIsEmpty(editor.isEmpty)
      onChange(editor.getHTML())
    },
  })

  return (
    <div
      className={cn(
        "relative rounded-xl border border-input bg-background transition-colors focus-within:border-ring",
        className
      )}
    >
      <Toolbar editor={editor} />
      <div className="relative">
        {isEmpty && placeholder && (
          <p className="pointer-events-none absolute top-2 left-3 text-sm text-muted-foreground">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} spellCheck={false} />
      </div>
    </div>
  )
}
