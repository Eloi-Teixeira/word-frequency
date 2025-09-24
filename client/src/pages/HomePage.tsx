import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { CircleCheckBig, RefreshCcw, Shield, Zap } from 'lucide-react';
import { useState } from 'react';
import Footer from '../components/utils/Footer';

export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      q: 'É gratuito?',
      a: 'Sim, o Notare foi desenvolvido para ser uma ferramenta gratuita e acessível a todos.',
    },
    {
      q: 'Posso acessar offline?',
      a: 'Não, Notare não oferece este tipo de serviço no momento.',
    },
    {
      q: 'Minhas notas são privadas?',
      a: 'Suas notas são suas: usamos criptografia em trânsito e em repouso nos planos pagos.',
    },
    {
      q: 'Existe versão mobile?',
      a: 'Sim — apps mobile e versão web responsiva estão planejadas (versão beta disponível).',
    },
  ];

  const features = [
    {
      icon: <Zap size={16} color="#fff" />,
      title: 'Produtividade',
      description: 'Fluxo limpo para manter o foco.',
    },
    {
      icon: <CircleCheckBig size={16} color="#fff" />,
      title: 'Anotações Rápidas',
      description: 'Capture ideias em um clique.',
    },
    {
      icon: <Shield size={16} color="#fff" />,
      title: 'Segurança',
      description: 'Criptografia e privacidade desde o início.',
    },
    {
      icon: <RefreshCcw size={16} color="#fff" />,
      title: 'Sincronização',
      description: 'Acesse suas notas em todos os dispositivos',
    },
  ];

  return (
    <div className="home-page">
      <MotionConfig transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}>
        <header className="home-header">
          <Link to={'/'} className="logo">
            <div className="logo-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3 6.75L12 3l9 3.75v10.5L12 21 3 17.25V6.75z"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            Notare
          </Link>
          <nav>
            <a href="#works" className="btn-link">
              Como Funciona
            </a>
            <a href="#func" className="btn-link">
              Funcionalidades
            </a>
            <a href="#qr" className="btn-link">
              Perguntas Frequentes
            </a>
          </nav>
          <Link to={'/auth/login'} className="login-btn">
            Login
          </Link>
        </header>

        <main className="home-main">
          <section className="home-hero home-section">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Capture Ideias em Segundos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300 max-w-xl"
            >
              Transforme pensamentos em notas organizadas de forma instantânea.
              Sem distrações, sem complicações — apenas você e sua criatividade
              fluindo
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Link to={'/auth/login'} className="btn-primary">
                Começar Agora
              </Link>
              <a href={'#func'} className="btn-secondary">
                Ver Recursos
              </a>
            </motion.div>
            <motion.div
              className="home-hero-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              style={{ transformOrigin: 'center' }}
            />
          </section>

          <section id="works" className="home-section">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="subtitle">Como Funciona</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Organize suas ideias de forma simples e poderosa
              </motion.h1>
              <p className="description">
                Um espaço minimalista para anotações rápidas, foco e
                produtividade. Escrita limpa, busca instantânea e tudo
                sincronizado quando você precisar.
              </p>
              <div>
                <Link to={'/auth/login'} className="btn-primary">
                  Experimente Gratuitamente
                </Link>
                <a href="#func" className="btn-link">
                  Conheça as Funcionalidades
                </a>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="home-figure"
            >
              <div className="notare-mockup-header">
                <span className="notare-logo">Notare</span>
                <span>Untitled.md</span>
              </div>
              <div className="notare-content">
                <h3># Nota rápida</h3>
                <p>
                  Escreva pensamentos, organize tarefas e capture inspiração —
                  tudo sem distrações.
                </p>
                <div className="notare-features">
                  <div className="notare-feature">- Buscar</div>
                  <div className="notare-feature">- Tags</div>
                  <div className="notare-feature">- Exportar</div>
                  <div className="notare-feature">- Markdown</div>
                </div>
              </div>
            </motion.div>
          </section>
          <section id="func" className="home-section">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="subtitle">Funcionalidades</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="title-lg"
              >
                Recursos que tornam sua experiência incrível
              </motion.h1>
              <p className="description">
                Organize velocidade de pensamento com uma interface que respeita
                seu foco. Tagueie, pesquise e recupere ideias em segundos.
              </p>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="icon-bg">{feature.icon}</div>
                    <div>
                      <h2>{feature.title}</h2>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img src={undefined} alt="Ilustração de anotações organizadas" />
            </div>
          </section>
          <section id="qr" className="home-qr home-section">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="subtitle">Respostas</span>
            </motion.div>
            <h1>Alguma dúvida? Aqui está a resposta</h1>
            <p>
              Ainda ficou com alguma dúvida? Envie um email para
              support@notare.app <br />
              <span>(email fictício)</span>
            </p>
            <div className="faq-grid">
              {faqs.map((f, i) => (
                <div key={i} className="faq-item">
                  <button
                    aria-expanded={openFAQ === i}
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    className="faq-question"
                  >
                    <div>
                      <p className="faq-question">{f.q}</p>
                    </div>

                    <div className="faq-icon">{openFAQ === i ? '-' : '+'}</div>
                  </button>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={
                      openFAQ === i
                        ? { height: 'auto', opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.28 }}
                  >
                    <div className="faq-answer">{f.a}</div>
                  </motion.div>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </MotionConfig>
    </div>
  );
}
