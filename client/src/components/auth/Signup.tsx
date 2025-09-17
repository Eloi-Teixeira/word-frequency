import { Link } from 'react-router-dom';
import useManageUser from '../../hook/useManageUser';
import Input from '../helper/Input';

export default function Signup() {
  const { onCreateUser, Feedback, isLoading } = useManageUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = e.currentTarget.username.value;
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    const confirmPassword = e.currentTarget.confirmPassword.value;
    await onCreateUser({
      username,
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <div className="auth-form">
      <h1>Crie uma Conta</h1>
      <p>
        Já possui uma conta? <Link to={'/auth/login'}>Entre aqui</Link>
      </p>
      <form className="register-form" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nome"
          name="username"
          autoComplete="on"
          required
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          autoComplete="on"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Senha"
          autoComplete="off"
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirme a senha"
          autoComplete="off"
          required
        />
        <label className="terms-btn">
          <input type="checkbox" name="terms" required />
          <span>
            Li e concordo com os <Link to="/about">termos de uso</Link>
          </span>
        </label>
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Criar Conta'}
        </button>
      </form>
      {Feedback}
    </div>
  );
}
