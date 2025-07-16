import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    isPassword?: boolean,
  ) => {
    e.preventDefault();
    if (isPassword) {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="auth-form">
      <h1>Crie uma Conta</h1>
      <p>
        Já possui uma conta? <Link to={'/auth/login'}>Entre aqui</Link>
      </p>
      <form
        className="register-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="Nome"
          name="username"
          autoComplete="on"
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          autoComplete="on"
          required
        />
        <label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            autoComplete="off"
            name="password"
            required
          />
          <button
            className="show-btn"
            onClick={(e) => {
              togglePassword( e, true);
            }}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </button>
        </label>
        <label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirme a senha"
            autoComplete="off"
            name="confirmPassword"
            required
          />
          <button
            className="show-btn"
            onClick={(e) => {
              togglePassword(e);
            }}
          >
            {showConfirmPassword ? <EyeClosed /> : <Eye />}
          </button>
        </label>
        <label className="terms-btn">
          <input type="checkbox" name="terms" required />
          <span>
            Li e concordo com os <Link to="/about">termos de uso</Link>
          </span>
        </label>
        <button type="submit" className="submit-btn">
          Criar Conta
        </button>
      </form>
    </div>
  );
}
