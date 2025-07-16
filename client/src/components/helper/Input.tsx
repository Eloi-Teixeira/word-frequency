
interface InputProps {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  type,
  name,
  placeholder,
  autoComplete,
  required,
  value,
  onChange,
}: InputProps) {
  return (
    <label>
      {label}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}