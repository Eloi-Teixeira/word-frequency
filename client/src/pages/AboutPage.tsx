import Footer from '../components/utils/Footer';

export default function AboutPage() {
  return (
    <div className="about-page" lang="pt-BR">
      <header className="about-header">
        <div className="brand">
          <div className="logo" aria-hidden="true">
            ✎
          </div>
          <h1 className="title">Notare</h1>
        </div>
        <p className="subtitle">
          Um espaço para rascunhos, experimentos e aprendizado.
        </p>
      </header>

      <main className="about-main">
        <section className="card">
          <h2>Sobre o projeto</h2>
          <p>
            Este site de anotações foi desenvolvido exclusivamente como um{' '}
            <strong>projeto de estudo</strong> e demonstração de técnicas de
            desenvolvimento web. O foco é aprendizado, iteração e experimentação
            — não a oferta de um serviço de armazenamento confiável.
          </p>
        </section>

        <section
          className="warning card"
          aria-labelledby="warning-title"
        >
          <div className="warning-icon" aria-hidden="true">
            ⚠
          </div>
          <div className="warning-text">
            <h3 id="warning-title">Aviso Importante</h3>
            <ul>
              <li>
                <strong>Sem garantia de permanência:</strong> as anotações podem
                ser removidas, perder-se em atualizações ou desaparecer sem
                aviso.
              </li>
              <li>
                <strong>Sem garantia de segurança ou privacidade:</strong> os
                dados não são protegidos de forma robusta ou garantida.
              </li>
              <li>
                <strong>Não use para informações sensíveis:</strong> evite
                armazenar senhas, documentos importantes ou dados pessoais
                críticos.
              </li>
            </ul>
          </div>
        </section>

        <section className="card">
          <h2 id='help'>Como usar</h2>
          <p>
            Use este ambiente para rascunhos, testes e para aprender. Se alguma
            nota for importante, mantenha um backup local ou utilize um serviço
            confiável com garantias de segurança e retenção.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
