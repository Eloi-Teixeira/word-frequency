import { Note } from '../../context/notesContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  linkPlugin,
  tablePlugin,
  MDXEditorMethods, 
} from '@mdxeditor/editor';

interface EditorNotesProps {
  note: Note;
  saveNote: (note: Note) => void;
}

export const EditorNotes = ({ note, saveNote }: EditorNotesProps) => {
  const [title, setTitle] = useState(note.title);

  const latestNoteRef = useRef<Note>(note);
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    latestNoteRef.current = note;
  }, [note]);

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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      latestNoteRef.current.updatedAt = new Date();
      saveNote(latestNoteRef.current);
      console.log(
        'Nota salva via beforeunload (MDX Editor):',
        latestNoteRef.current,
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      handleBeforeUnload();
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [note]);

  useEffect(() => {
    setTitle(note.title);
  }, [note]);

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
        <MDXEditor
          key={note._id}
          ref={editorRef}
          markdown={note.content}
          onChange={(newMarkdown) => {
            latestNoteRef.current = {
              ...latestNoteRef.current,
              content: newMarkdown,
            };
            debouncedSave();
          }}
          // Plugins para as funcionalidades do editor e da barra de ferramentas
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            codeBlockPlugin(),
            linkPlugin(),
            // tablePlugin(), // Exemplo de plugin adicional

            markdownShortcutPlugin(), // Permite atalhos de teclado Markdown (ex: ## para h2)

            // Plugin da barra de ferramentas (para botões visíveis)
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo /> {/* Botões de desfazer/refazer */}
                  <BoldItalicUnderlineToggles />{' '}
                  {/* Botões de negrito, itálico, sublinhado */}
                  {/* Você pode adicionar mais componentes de toolbar aqui, ex:
                  <CreateLink />
                  <BlockTypeSelect />
                  <ChangeCodeMirrorLanguage />
                  <InsertImage />
                  ... e muitos outros que vêm com os plugins
                  */}
                </>
              ),
            }),
          ]}
          placeholder="Comece a escrever sua nota..."
          // readOnly={false} // Se o editor deve ser apenas leitura
        />
      </div>
    </article>
  );
};
