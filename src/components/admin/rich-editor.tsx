"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle, Color } from "@tiptap/extension-text-style";

const COLORS = ["#2b2620", "#8f3b31", "#6b7a5e", "#6b7a9e", "#a06a2c", "#ffffff"];

export default function RichEditor({
  value,
  onChange,
  blockTools = false,
  onUploadStateChange,
}: {
  value: string;
  onChange: (html: string) => void;
  blockTools?: boolean;
  onUploadStateChange?: (busy: boolean) => void;
}) {
  const [blockMenu, setBlockMenu] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false, heading: { levels: [2, 3, 4] } }),
      TextStyle,
      Color,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener" } }),
      Image.configure({ HTMLAttributes: { class: "rich-img" } }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "rich min-h-[240px] max-w-none rounded-b-md border border-t-0 border-line bg-white px-4 py-3 text-sm focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // keep external resets in sync (e.g. after save)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  const addImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      onUploadStateChange?.(true);
      try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.url) editor.chain().focus().setImage({ src: body.url }).run();
      else alert(body?.error ?? "Upload failed");
      } catch { alert("Upload failed. Please retry."); }
      finally { onUploadStateChange?.(false); }
    };
    input.click();
  }, [editor, onUploadStateChange]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addButton = useCallback(() => {
    if (!editor) return;
    const label = window.prompt("Button label", "Learn more");
    if (!label) return;
    const url = window.prompt("Button link", "/contact");
    if (!url) return;
    editor
      .chain()
      .focus()
      .insertContent({ type: "paragraph", content: [{ type: "text", text: label, marks: [{ type: "link", attrs: { href: url } }] }] })
      .run();
  }, [editor]);

  if (!editor) return null;

  const Btn = ({
    on,
    active,
    children,
    title,
  }: {
    on: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      title={title}
      onClick={on}
      className={`rounded px-2 py-1 text-xs font-semibold ${
        active ? "bg-accent text-white" : "bg-white text-foreground hover:bg-[#f0ebe0]"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-line bg-[#f4efe6] p-2">
        <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          B
        </Btn>
        <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <span className="italic">I</span>
        </Btn>
        <Btn on={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <span className="line-through">S</span>
        </Btn>
        <span className="mx-1 h-4 w-px bg-line" />
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          H2
        </Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          H3
        </Btn>
        <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
          • List
        </Btn>
        <Btn on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
          1. List
        </Btn>
        <Btn on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
          &ldquo;&rdquo;
        </Btn>
        <span className="mx-1 h-4 w-px bg-line" />
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            title={`Text colour ${c}`}
            onClick={() => editor.chain().focus().setColor(c).run()}
            className="h-5 w-5 rounded-full border border-line"
            style={{ backgroundColor: c }}
          />
        ))}
        <Btn on={() => editor.chain().focus().unsetColor().run()} title="Clear colour">
          ⨯
        </Btn>
        <span className="mx-1 h-4 w-px bg-line" />
        <Btn on={setLink} active={editor.isActive("link")} title="Add / edit link">
          Link
        </Btn>
        <Btn on={addImage} title="Insert image">
          Image
        </Btn>
        <Btn on={addButton} title="Insert call-to-action link">
          Call to action
        </Btn>
      </div>
      {blockTools && <div className="border-x border-line bg-white p-2"><button type="button" aria-expanded={blockMenu} onClick={() => setBlockMenu(!blockMenu)} className="btn btn-outline">+ Add block</button><button type="button" onClick={() => editor.chain().focus().undo().run()} className="ml-3 text-sm underline">Undo</button><button type="button" onClick={() => editor.chain().focus().redo().run()} className="ml-3 text-sm underline">Redo</button>{blockMenu && <div className="mt-3 flex flex-wrap gap-2">{[
        ["Paragraph", () => editor.chain().focus().insertContent("<p>New paragraph</p>").run()],
        ["Heading", () => editor.chain().focus().insertContent("<h2>New heading</h2>").run()],
        ["Photo", addImage], ["Link", setLink],
        ["Bullet list", () => editor.chain().focus().insertContent("<ul><li><p>List item</p></li></ul>").run()],
        ["Numbered list", () => editor.chain().focus().insertContent("<ol><li><p>List item</p></li></ol>").run()],
        ["Quote", () => editor.chain().focus().insertContent("<blockquote><p>Your quote</p></blockquote>").run()],
        ["Divider", () => editor.chain().focus().setHorizontalRule().run()],
      ].map(([label, action]) => <button type="button" key={String(label)} className="border border-line px-3 py-2 text-sm" onClick={() => { (action as () => void)(); setBlockMenu(false); }}>{String(label)}</button>)}</div>}</div>}
      <EditorContent editor={editor} />
    </div>
  );
}
