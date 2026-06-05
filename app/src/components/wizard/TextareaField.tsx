import { AlertCircle } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  optional?: boolean;
  minHeight?: number;
  maxLength?: number;
  hint?: string;
}

export function TextareaField({
  label, name, value, onChange, placeholder = '', required = false,
  error, optional = false, minHeight = 120, maxLength, hint,
}: TextareaFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(minHeight, el.scrollHeight) + 'px';
  }, [value, minHeight]);

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
        {maxLength && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: value.length > maxLength * 0.9 ? 'var(--error)' : 'var(--text-muted)',
          }}>
            {value.length}/{maxLength}
          </span>
        )}
      </label>
      <textarea
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`input-field resize-none ${error ? 'error' : ''}`}
        style={{ minHeight, lineHeight: 1.65 }}
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
