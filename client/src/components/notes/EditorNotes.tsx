import { EditorContent, EditorProvider, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Note } from '../../context/notesContext';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';

interface EditorNotesProps {
  note: Note;
  saveNote: (note: Note) => void;
}

const turndownOption: TurndownService.Options = {
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined',
};

export const EditorNotes = ({ note, saveNote }: EditorNotesProps) => {
  const [title, setTitle] = useState(note.title);

  const md = useMemo(() => new MarkdownIt(), []);
  const turndownService = useMemo(
    () => new TurndownService(turndownOption),
    [],
  );

  const content = md.render(note.content) || '';
  const latestNoteRef = useRef<Note>(note);

  useEffect(() => {
    latestNoteRef.current = note;
  }, [note]);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveNote(latestNoteRef.current);
    }, 1500);
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitleValue = e.target.value;
    const processedTitle =
      newTitleValue.length === 0 ? 'Sem título' : newTitleValue.trim();

    setTitle(newTitleValue);

    latestNoteRef.current = {
      ...latestNoteRef.current,
      title: processedTitle,
    };

    debouncedSave();
  };

  const handleTitleBlur = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    const processedTitle = title.length === 0 ? 'Sem título' : title.trim();
    latestNoteRef.current = {
      ...latestNoteRef.current,
      title: processedTitle,
    };
    saveNote(latestNoteRef.current);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: { class: 'notion-heading' },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          return node.type.name === 'heading' && node.attrs.level === 1
            ? 'Título da nota…'
            : 'Comece a escrever...';
        },
        includeChildren: true,
        showOnlyCurrent: false,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
    onUpdate: ({ editor }) => {
      const newContent = turndownService.turndown(editor.getHTML());
      latestNoteRef.current.content = newContent;

      debouncedSave();
    },
    onBlur: ({ editor }) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      const newContent = turndownService.turndown(editor.getHTML());
      latestNoteRef.current.content = newContent;
      saveNote(latestNoteRef.current);
    },
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      latestNoteRef.current.updatedAt = new Date();
      if (editor) {
        latestNoteRef.current.content = turndownService.turndown(
          editor.getHTML(),
        );
      }
      saveNote(latestNoteRef.current);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      handleBeforeUnload();
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [note]);

  useEffect(() => {
    if (editor) {
      setTitle(note.title);
      const currentEditorContent = turndownService.turndown(editor.getHTML());
      const newNoteContent = turndownService.turndown(md.render(note.content));
      if (currentEditorContent !== newNoteContent) {
        editor.commands.setContent(content, false);
      }
    }
  }, [note, editor]);

  return (
    <article>
      <div className="editor-container">
        <input
          className="title-input"
          name="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Título da nota"
          onBlur={handleTitleBlur}
        />
        <EditorContent editor={editor} />
      </div>
    </article>
  );
};
