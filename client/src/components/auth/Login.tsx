import { Link } from 'react-router-dom';
import useManageUser from '../../hook/useManageUser';
import Input from '../utils/Input';

export default function Login() {
  const { onLogin, Feedback, isLoading } = useManageUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value.trim();
    const password = e.currentTarget.password.value.trim();
    await onLogin(email, password);
  };

  return (
    <div className="auth-form">
      <h1>Entre em sua Conta</h1>
      <p>
        Não possui uma conta? <Link to={'/auth/signup'}>Crie uma</Link>
      </p>
      <form className="register-form" onSubmit={handleSubmit}>
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
        <button className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Carragando...' : 'Entrar'}
        </button>
      </form>
      {Feedback}
    </div>
  );
}
