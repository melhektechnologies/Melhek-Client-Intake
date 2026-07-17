import { AlertCircle } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { Tooltip } from './Tooltip';

interface TextareaFieldProps {
  label: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  optional?: boolean;
  minHeight?: number;
  maxLength?: number;
  hint?: string;
  icon?: React.ReactNode;
  info?: string;
  rows?: number;
}

export function TextareaField({
  label, name, value, onChange, placeholder = '', required = false,
  error, optional = false, minHeight = 100, maxLength, hint, icon, rows, info,
}: TextareaFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const inputId = name || label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Auto-resize
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(minHeight, el.scrollHeight) + 'px';
  }, [value, minHeight]);

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="input-label flex items-center justify-between">
        <span className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
          {info && <Tooltip text={info} />}
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
        id={inputId}
        name={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
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
