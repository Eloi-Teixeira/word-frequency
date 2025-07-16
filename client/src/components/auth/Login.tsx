import { Link } from 'react-router-dom';

export default function login() {
  return (
    <div className="auth-form">
      <h1>Entre em sua Conta</h1>
      <p>
        Não possui uma conta? <Link to={'/auth/signup'}>Crie uma</Link>
      </p>
      <form
        className="register-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id='email' autoComplete="on" required />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input type="password" name="password" id='password' autoComplete="on" required />
        </div>
        <button className="submit-btn">Login</button>
      </form>
    </div>
  );
}
