import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';

interface InputProps {
  type: string;
  name: string;
  placeholder: string;
  autoComplete?: 'on' | 'off';
  required?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  type,
  name,
  placeholder,
  autoComplete,
  required,
  value,
  onChange,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const togglePassword = (
    e: React.MouseEvent<HTMLButtonElement>,
    show: boolean,
  ) => {
    e.preventDefault();
    setShowPassword(show);
  };

  return (
    <label>
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
      />
      {isPassword && (
        <button
          className="show-btn"
          onClick={(e) => {
            togglePassword(e, !showPassword);
          }}
        >
          {showPassword ? <EyeClosed /> : <Eye />}
        </button>
      )}
    </label>
  );
}
