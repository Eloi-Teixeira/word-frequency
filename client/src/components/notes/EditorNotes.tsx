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
import { Tag } from 'lucide-react';

interface EditorNotesProps {
  note: Note;
  saveNote: (note: Note) => void;
  setSearch: (search: string) => void;
}

// - [ ] Erro Ao salvar nota após alteração do conteúdo
// - [ ] Erro ao adicionar nota vazia, criação de um editor paralelo

export const EditorNotes = ({ note, saveNote }: EditorNotesProps) => {
  const [title, setTitle] = useState(note.title);

  const latestNoteRef = useRef<Note>(note);
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTitle(note.title);
    latestNoteRef.current = note;
  }, [note]);

  const hasNoteChanged = useCallback((currentNote: Note) => {
    return (
      latestNoteRef.current.title !== currentNote.title ||
      latestNoteRef.current.content !== currentNote.content
    );
  }, []);

  const debouncedSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const currentTitle =
        title.trim().length === 0 ? 'Sem título' : title.trim();
      const currentContent = editorRef.current?.getMarkdown() ?? note.content;

      const noteToSave: Note = {
        ...note,
        title: currentTitle,
        content: currentContent,
        updatedAt: new Date(),
      };
      if (!hasNoteChanged(noteToSave)) {
        console.log('Nota inalterada no debounce, pulando salvamento.');
        return;
      }
      latestNoteRef.current = { ...noteToSave };
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      latestNoteRef.current.updatedAt = new Date();
      saveNote(latestNoteRef.current);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      handleBeforeUnload();
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [note]);

  return (
    <article className="editor-notes">
      <div className="editor-container">
        <input
          className="title-input"
          name="title"
          value={title}
          onChange={handleTitleChange}
          type="text"
          onBlur={(e) => {
            setTitle(e.target.value.trim());
            latestNoteRef.current.title = title;
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
          }}
          placeholder="Título da nota"
        />
        <div className="tags-container">
          {note.tags.map((t, i) => {
            return (
              <span className="tag" key={t + i}>
                <Tag />
                {t}
              </span>
            );
          })}
        </div>
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
          onBlur={() => {
            latestNoteRef.current.updatedAt = new Date();
            saveNote(latestNoteRef.current);
          }}
          // suppressHtmlProcessing={true}
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
              toolbarContents: () => {
                if (note.isDeleted) {
                  return <>Não editavel</>;
                }
                return (
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
                );
              },
            }),
          ]}
          placeholder="Comece a escrever sua nota..."
          readOnly={note.isDeleted} // Se o editor deve ser apenas leitura
        />
      </div>
    </article>
  );
};
