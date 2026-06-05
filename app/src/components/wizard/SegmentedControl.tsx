import { AlertCircle } from 'lucide-react';

interface SegmentedControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  error?: string;
}

export function SegmentedControl({ label, value, onChange, options, required = false, error }: SegmentedControlProps) {
  const selectedIndex = options.indexOf(value);

  return (
    <div className="w-full">
      <label className="input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div
        className="relative flex p-1 rounded-xl gap-1"
        style={{ background: 'rgba(7,15,60,0.5)', border: '1px solid var(--border)' }}
      >
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className="flex-1 py-3 px-3 text-sm font-semibold transition-all duration-250 rounded-lg"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--dark)' : 'var(--text-tertiary)',
                background: active
                  ? 'linear-gradient(135deg, var(--electric-dim), var(--electric))'
                  : 'transparent',
                boxShadow: active ? '0 0 12px rgba(127,169,255,0.3)' : 'none',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {error && (
        <div className="error-message">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
}
