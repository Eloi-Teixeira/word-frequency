import React, { Component, createRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Search,
  Bold,
  Italic,
  Link,
  List,
  Quote,
  Code2,
  Type,
} from 'lucide-react';

// Types
interface HeaderElement {
  level: number;
  text: string;
  line: number;
}

interface LinkElement {
  text: string;
  url: string;
  line: number;
}

interface ImageElement {
  alt: string;
  url: string;
  line: number;
}

interface CodeBlockElement {
  language: string;
  content: string;
  line: number;
}

interface ListElement {
  type: 'ordered' | 'unordered';
  items: string[];
  line: number;
}

interface TOCElement {
  level: number;
  text: string;
  anchor: string;
  line: number;
}

interface ValidationResult {
  line: number;
  message: string;
  type: 'warning' | 'error';
}

interface MarkdownAnalysis {
  headers: HeaderElement[];
  links: LinkElement[];
  images: ImageElement[];
  codeBlocks: CodeBlockElement[];
  lists: ListElement[];
  wordCount: number;
  characterCount: number;
  readingTime: number;
  tableOfContents: TOCElement[];
  validationResults: ValidationResult[];
  tags: string[];
}

interface MarkdownEditorProps {
  initialText?: string;
  onChange?: (markdown: string, html: string, tags: string[]) => void;
  className?: string;
}

interface MarkdownEditorState {
  markdown: string;
  tags: string[];
  showAnalysis: boolean;
  showRawMarkdown: boolean;
  cursorPosition: { line: number; column: number };
}

class MarkdownEditor extends Component<
  MarkdownEditorProps,
  MarkdownEditorState
> {
  private textareaRef = createRef<HTMLTextAreaElement>();
  private debounceTimeout: NodeJS.Timeout | null = null;
  private readonly previewRef = createRef<HTMLDivElement>();

  constructor(props: MarkdownEditorProps) {
    super(props);

    this.state = {
      markdown: props.initialText || '',
      tags: this.analyzeMarkdown(props.initialText || '').tags,
      showAnalysis: false,
      showRawMarkdown: true,
      cursorPosition: { line: 1, column: 1 },
    };
  }

  private getDefaultText(): string {
    return `# Bem-vindo ao Editor Markdown

Este é um **editor de markdown** onde você pode editar e visualizar o resultado em tempo real.

## Como usar

- Clique no botão <Type /> para alternar entre a **edição de código** e o **preview**.
- Utilize a barra de ferramentas para formatação rápida.
- A análise de conteúdo fornece estatísticas úteis.

### Funcionalidades suportadas #funcionalidades #markdown #editor

1. **Formatação de texto**: *itálico*, **negrito**, \`código inline\`
2. **Links**: [GitHub](https://github.com)
3. **Listas** ordenadas e não ordenadas
4. **Citações** e blocos de código
5. **Imagens** e tabelas

> 💡 **Dica**: A visualização ao vivo será exibida ao desativar o "Modo Código".

\`\`\`javascript
// Exemplo de bloco de código
function saudar(nome) {
  return \`Olá, \${nome}!\`;
}
\`\`\`

---

**Experimente editar este texto agora mesmo!** 🚀 #react #editor`;
  }

  // Métodos públicos
  public getText(): string {
    return this.state.markdown;
  }

  public getTags(): string[] {
    return [...this.state.tags];
  }

  public getHtml(): string {
    return this.parseMarkdown(this.state.markdown);
  }

  public getAnalysis(): MarkdownAnalysis {
    return this.analyzeMarkdown(this.state.markdown);
  }

  public insertText(text: string, replace: boolean = false): void {
    const textarea = this.textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    let newMarkdown: string;
    let newCursorPos: number;

    if (replace) {
      newMarkdown = text;
      newCursorPos = text.length;
    } else {
      newMarkdown =
        this.state.markdown.substring(0, start) +
        text +
        this.state.markdown.substring(end);
      newCursorPos = start + text.length;
    }

    this.setState({ markdown: newMarkdown }, () => {
      setTimeout(() => {
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
      this.handleChange();
    });
  }

  public clear(): void {
    this.setState(
      {
        markdown: '',
        tags: [],
      },
      () => {
        this.handleChange();
      },
    );
  }

  public exportData(): {
    text: string;
    html: string;
    tags: string[];
    analysis: MarkdownAnalysis;
  } {
    const analysis = this.analyzeMarkdown(this.state.markdown);
    return {
      text: this.state.markdown,
      html: this.parseMarkdown(this.state.markdown),
      tags: [...this.state.tags],
      analysis,
    };
  }

  // Adicione esta nova função
  private scrollToHeader = (anchor: string): void => {
    // Primeiro, garanta que estamos no modo visual para que o scroll funcione
    this.setState({ showRawMarkdown: false }, () => {
      const element = this.previewRef.current?.querySelector(`#${anchor}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  };

private parseMarkdown(text: string): string {
    const createAnchorId = (str: string): string => {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const lines = text.split('\n');
    let finalHtml = '';
    let inBlock = false;
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';

    lines.forEach((line) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('```')) {
            if (inCodeBlock) {
                // Fim do bloco de código
                if (inBlock) {
                    finalHtml += '</p>';
                    inBlock = false;
                }
                const languageHtml = codeBlockLanguage ? `<span class="language-label">${codeBlockLanguage}</span>` : '';
                finalHtml += `<div class="code-block-container">${languageHtml}<pre><code>${codeBlockContent.trim()}</code></pre></div>`;
                inCodeBlock = false;
                codeBlockContent = '';
                codeBlockLanguage = '';
                return;
            } else {
                // Início do bloco de código
                if (inBlock) {
                    finalHtml += '</p>';
                    inBlock = false;
                }
                inCodeBlock = true;
                codeBlockLanguage = trimmedLine.slice(3).trim();
                return;
            }
        }

        if (inCodeBlock) {
            codeBlockContent += line + '\n';
            return;
        }

        const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
        if (headerMatch) {
            if (inBlock) {
                finalHtml += '</p>';
                inBlock = false;
            }
            const level = headerMatch[1].length;
            const content = headerMatch[2];
            const sanitizedId = createAnchorId(content);
            finalHtml += `<h${level} id="${sanitizedId}">${content}</h${level}>`;
            return;
        }

        if (
            trimmedLine.startsWith('<img') ||
            trimmedLine.startsWith('<blockquote') ||
            trimmedLine.startsWith('<hr')
        ) {
            if (inBlock) {
                finalHtml += '</p>';
                inBlock = false;
            }
            finalHtml += line;
            return;
        }

        if (trimmedLine.startsWith('<li')) {
            if (!inBlock) {
                finalHtml += '<ul class="prose">';
                inBlock = true;
            }
            finalHtml += line;
            return;
        }

        if (trimmedLine === '') {
            if (inBlock) {
                finalHtml += '</p>';
                inBlock = false;
            }
            finalHtml += '<br/>';
            return;
        }

        if (!inBlock) {
            finalHtml += '<p class="prose">';
            inBlock = true;
        }

        // Processa tags e outros elementos inline na linha atual
        let processedLine = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                '<a href="$2" target="_blank" rel="noopener" class="prose">$1</a>',
            )
            .replace(
                /!\[([^\]]*)\]\(([^)]+)\)/g,
                '<img src="$2" alt="$1" class="prose" />',
            )
            .replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>')
            .replace(/^---$/gm, '<hr>')
            .replace(/^\s*([\*\-\+])\s+(.*)$/gm, '<li class="prose">$2</li>')
            .replace(/^\s*(\d+\.)\s+(.*)$/gm, '<li class="prose">$2</li>');

        let counter = 0;
        processedLine = processedLine.replace(/\s#(\w+)\b/g, (match, tagName) => {
            const id = `tag-${tagName}-${counter++}`;
            return ` <span id="${id}" class="tag-anchor">${match.trim()}</span>`;
        });

        finalHtml += processedLine + ' ';
    });

    if (inBlock) {
        finalHtml += '</p>';
    }

    return finalHtml;
}

  private analyzeMarkdown(text: string): MarkdownAnalysis {
    const lines = text.split('\n');

    const headers: HeaderElement[] = [];
    const links: LinkElement[] = [];
    const images: ImageElement[] = [];
    const codeBlocks: CodeBlockElement[] = [];
    const lists: ListElement[] = [];
    const validationResults: ValidationResult[] = [];
    const tags: string[] = [];

    let inCodeBlock = false;
    let currentCodeBlock: {
      language: string;
      content: string[];
      startLine: number;
    } | null = null;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          const language = line.slice(3).trim() || 'text';
          currentCodeBlock = { language, content: [], startLine: lineNumber };
        } else {
          inCodeBlock = false;
          if (currentCodeBlock) {
            codeBlocks.push({
              language: currentCodeBlock.language,
              content: currentCodeBlock.content.join('\n'),
              line: currentCodeBlock.startLine,
            });
            currentCodeBlock = null;
          }
        }
        return;
      } else if (inCodeBlock && currentCodeBlock) {
        currentCodeBlock.content.push(line);
        return;
      }

      const tagMatches = line.matchAll(/\B#\w+\b/g);
      for (const match of tagMatches) {
        if (match[0]) {
          const tag = match[0].substring(1).toLowerCase();
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        }
      }

      const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
      if (headerMatch) {
        headers.push({
          level: headerMatch[1].length,
          text: headerMatch[2],
          line: lineNumber,
        });
      }

      const linkMatches = [...line.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
      linkMatches.forEach((match) => {
        links.push({
          text: match[1],
          url: match[2],
          line: lineNumber,
        });
      });

      const imageMatches = [...line.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
      imageMatches.forEach((match) => {
        images.push({
          alt: match[1],
          url: match[2],
          line: lineNumber,
        });
      });

      const listMatch = line.match(/^[\*\-\+]\s+(.+)|^\d+\.\s+(.+)/);
      if (listMatch) {
        const isOrdered = /^\d+\./.test(line);
        lists.push({
          type: isOrdered ? 'ordered' : 'unordered',
          items: [listMatch[1] || listMatch[2]],
          line: lineNumber,
        });
      }

      if (
        line.includes('](') &&
        !line.match(/\[([^\]]+)\]\(([^)]+)\)/) &&
        !inCodeBlock
      ) {
        validationResults.push({
          line: lineNumber,
          message: 'Possível sintaxe de link malformada',
          type: 'warning',
        });
      }
    });

    const wordCount = text
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const characterCount = text.length;
    const readingTime = Math.ceil(wordCount / 200);

    const tableOfContents: TOCElement[] = headers.map((header) => ({
      level: header.level,
      text: header.text,
      anchor: header.text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/^-+|-+$/g, ''),
      line: header.line,
    }));

    return {
      headers,
      links,
      images,
      codeBlocks,
      lists,
      wordCount,
      characterCount,
      readingTime,
      tableOfContents,
      validationResults,
      tags,
    };
  }

  private handleChange = (): void => {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      const { markdown, tags } = this.state;
      if (this.props.onChange) {
        this.props.onChange(markdown, this.parseMarkdown(markdown), tags);
      }
    }, 300);
  };

  private handleMarkdownChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const newValue = e.target.value;
    const textarea = e.target;

    const textBeforeCursor = newValue.substring(0, textarea.selectionStart);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    const newTags = this.analyzeMarkdown(newValue).tags;

    this.setState(
      {
        markdown: newValue,
        tags: newTags,
        cursorPosition: { line, column },
      },
      () => {
        this.handleChange();
      },
    );
  };

  private insertMarkdown = (before: string, after: string = ''): void => {
    const textarea = this.textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.state.markdown.substring(start, end);
    const newText = before + selectedText + after;

    const newMarkdown =
      this.state.markdown.substring(0, start) +
      newText +
      this.state.markdown.substring(end);

    this.setState({ markdown: newMarkdown }, () => {
      setTimeout(() => {
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(
            start + before.length,
            start + before.length + selectedText.length,
          );
        }
      }, 0);
      this.handleChange();
    });
  };

  private handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          this.insertMarkdown('**', '**');
          break;
        case 'i':
          e.preventDefault();
          this.insertMarkdown('*', '*');
          break;
        case 'k':
          e.preventDefault();
          this.insertMarkdown('[', '](url)');
          break;
      }
    }
  };

  private toggleAnalysis = (): void => {
    this.setState({ showAnalysis: !this.state.showAnalysis });
  };

  private toggleRawMarkdown = (): void => {
    this.setState({ showRawMarkdown: !this.state.showRawMarkdown });
  };

  private scrollToTag = (tag: string, index: number): void => {
    // Altera para o modo visual
    this.setState({ showRawMarkdown: false }, () => {
      const id = `tag-${tag}-${index}`;
      const element = this.previewRef.current?.querySelector(`#${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  };

  render() {
    const { className } = this.props;
    const { markdown, tags, showAnalysis, showRawMarkdown, cursorPosition } =
      this.state;
    const html = this.parseMarkdown(markdown);
    const analysis = this.analyzeMarkdown(markdown);

    const buttonActive = showRawMarkdown
      ? 'toolbar-button active'
      : 'toolbar-button';
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2, // intervalo entre cada filho
        },
      },
    };

    const item = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    };

    return (
      <AnimatePresence>
        <div className={`markdown-editor ${className || ''}`}>
          <div className="editor-toolbar">
            <div className="toolbar-group">
              <button
                onClick={() => this.insertMarkdown('**', '**')}
                className="toolbar-button"
                title="Negrito (Ctrl+B)"
              >
                <Bold className="toolbar-icon" />
              </button>
              <button
                onClick={() => this.insertMarkdown('*', '*')}
                className="toolbar-button"
                title="Itálico (Ctrl+I)"
              >
                <Italic className="toolbar-icon" />
              </button>
              <button
                onClick={() => this.insertMarkdown('[', '](url)')}
                className="toolbar-button"
                title="Link (Ctrl+K)"
              >
                <Link className="toolbar-icon" />
              </button>
              <button
                onClick={() => this.insertMarkdown('`', '`')}
                className="toolbar-button"
                title="Código"
              >
                <Code2 className="toolbar-icon" />
              </button>
              <button
                onClick={() => this.insertMarkdown('- ', '')}
                className="toolbar-button"
                title="Lista"
              >
                <List className="toolbar-icon" />
              </button>
              <button
                onClick={() => this.insertMarkdown('> ', '')}
                className="toolbar-button"
                title="Citação"
              >
                <Quote className="toolbar-icon" />
              </button>
            </div>

            {tags.length > 0 && (
              <div className="tags-container">
                <div className="tags-wrapper">
                  <span className="tags-label">Tags:</span>
                  <div className="tag-list">
                    {tags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => this.scrollToTag(tag, index)}
                        className="tag-item"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="toolbar-group">
              <button
                onClick={this.toggleRawMarkdown}
                className={buttonActive}
                title="Alternar Modo Código/Visual"
              >
                <Type className="toolbar-icon" />
              </button>

              <button
                onClick={this.toggleAnalysis}
                className={`toolbar-button ${showAnalysis ? 'active' : ''}`}
                title="Análise do Documento"
              >
                <BarChart className="toolbar-icon" />
              </button>
            </div>
          </div>

          <div className="editor-content">
            {showRawMarkdown ? (
              <textarea
                ref={this.textareaRef}
                name="editor"
                value={markdown}
                onChange={this.handleMarkdownChange}
                onKeyDown={this.handleKeyDown}
                className="editor-textarea"
                placeholder="Digite seu texto aqui..."
                spellCheck={false}
              />
            ) : (
              <div
                ref={this.previewRef}
                className="editor-preview"
                onClick={() => {
                  alert('Não é possivel editar no Modo Visual');
                }}
              >
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            )}

            {showAnalysis && (
              <motion.div
                key="card"
                initial={{ opacity: 0.5, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0.5, x: 200 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="analysis-panel"
              >
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="analysis-content"
                >
                  <motion.h3
                    variants={item}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="analysis-title"
                  >
                    <Search className="toolbar-icon" />
                    Análise do Documento
                  </motion.h3>
                  <motion.div
                    variants={item}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  >
                    <h4 className="analysis-subtitle">Estatísticas</h4>
                    <div className="analysis-stats">
                      <div className="analysis-stat-row">
                        <span>Palavras:</span>
                        <span className="analysis-stat-label">
                          {analysis.wordCount}
                        </span>
                      </div>
                      <div className="analysis-stat-row">
                        <span>Caracteres:</span>
                        <span className="analysis-stat-label">
                          {analysis.characterCount}
                        </span>
                      </div>
                      <div className="analysis-stat-row">
                        <span>Tempo de leitura:</span>
                        <span className="analysis-stat-label">
                          {analysis.readingTime > 0 && '~'}
                          {analysis.readingTime} min
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  {analysis.tableOfContents.length > 0 && (
                    <motion.div
                      variants={item}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    >
                      <h4 className="analysis-subtitle">Índice</h4>
                      <div className="toc-list">
                        {analysis.tableOfContents.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => this.scrollToHeader(item.anchor)}
                            className="toc-item"
                            style={{
                              paddingLeft: `${(item.level - 1) * 12}px`,
                            }}
                          >
                            {item.text}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div className="analysis-section">
                    {analysis.headers.length > 0 && (
                      <motion.div
                        variants={item}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      >
                        <h4 className="analysis-section-title">
                          Cabeçalhos ({analysis.headers.length})
                        </h4>
                        <div className="analysis-item-info">
                          {analysis.headers
                            .map((h) => `H${h.level}`)
                            .join(', ')}
                        </div>
                      </motion.div>
                    )}

                    {analysis.links.length > 0 && (
                      <motion.div
                        variants={item}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      >
                        <h4 className="analysis-section-title">
                          Links ({analysis.links.length})
                        </h4>
                        <div className="analysis-list">
                          {analysis.links.slice(0, 3).map((link, index) => (
                            <div key={index} className="analysis-link-item">
                              {link.text} → {link.url}
                            </div>
                          ))}
                          {analysis.links.length > 3 && (
                            <div className="analysis-item-info">
                              +{analysis.links.length - 3} mais
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {analysis.images.length > 0 && (
                      <motion.div
                        variants={item}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      >
                        <h4 className="analysis-section-title">
                          Imagens ({analysis.images.length})
                        </h4>
                      </motion.div>
                    )}

                    {analysis.codeBlocks.length > 0 && (
                      <motion.div
                        variants={item}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      >
                        <h4 className="analysis-section-title">
                          Blocos de Código ({analysis.codeBlocks.length})
                        </h4>
                        <div className="analysis-item-info">
                          {analysis.codeBlocks
                            .map((cb) => cb.language)
                            .join(', ')}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  {analysis.validationResults.length > 0 && (
                    <motion.div
                      variants={item}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="analysis-footer"
                    >
                      <h4 className="analysis-subtitle">Avisos</h4>
                      <div className="analysis-warnings">
                        {analysis.validationResults.map((result, index) => (
                          <div
                            key={index}
                            className={
                              result.type === 'warning'
                                ? 'warning-item'
                                : 'error-item'
                            }
                          >
                            Linha {result.line}: {result.message}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </div>

          <div className="editor-footer">
            <div className="footer-stats">
              <span>
                Linha: {cursorPosition.line}, Coluna: {cursorPosition.column}
              </span>
              <span>{analysis.wordCount} palavras</span>
              <span>{analysis.characterCount} caracteres</span>
            </div>
            <div className="footer-status">
              {analysis.validationResults.length > 0 && (
                <span className="warning-indicator">
                  {analysis.validationResults.length} aviso(s)
                </span>
              )}
              <span className="status-indicator">
                {showRawMarkdown ? 'Modo Edição' : 'Modo Visual'}
              </span>
            </div>
          </div>
        </div>
      </AnimatePresence>
    );
  }
}

export default MarkdownEditor;
