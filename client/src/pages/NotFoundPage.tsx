import { Link } from 'react-router-dom';
import NotFoundSVG from '../components/svgs/NotFoundSVG';

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <article>
        <div>
          <span>Notas</span>
          <h1>404 — Página não encontrada</h1>
          <p>
            Ops! A página que você está procurando não existe mais ou foi movida.
            Mas suas anotações estão seguras — vamos te levar de volta.
          </p>
          <nav className="links">
            <Link to="/" className='back'>Voltar para o início</Link>
            <Link to="/notes">Minhas notas</Link>
          </nav>
          <p className='card'>
            Dica: se você chegou aqui a partir de um link salvo, tente verificar
            se ele contém erros de digitação ou abra o menu de navegação para
            acessar suas notas recentes.
          </p>
          <p>
            Se o problema persistir,{' '}
            <Link to={'/about#contact'}>entre em contato com o suporte.</Link>
          </p>
        </div>
        <div className="illustration">
          <NotFoundSVG />
        </div>
      </article>
    </main>
  );
}
