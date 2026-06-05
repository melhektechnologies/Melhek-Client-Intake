import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  optional?: boolean;
  onBlur?: () => void;
  hint?: string;
}

export function FormInput({
  label, name, value, onChange, placeholder = '', type = 'text',
  required = false, error, optional = false, onBlur, hint,
}: FormInputProps) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="input-label flex items-center justify-between">
        <span>
          {label}
          {required && <span className="required">*</span>}
          {optional && (
            <span style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 6, fontWeight: 400 }}>(optional)</span>
          )}
        </span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`input-field ${error ? 'error' : ''}`}
      />
      {hint && !error && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>{hint}</p>
      )}
      {error && (
        <div className="error-message">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
}
