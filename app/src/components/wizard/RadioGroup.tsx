import { Check, AlertCircle } from 'lucide-react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  error?: string;
  horizontal?: boolean;
}

export function RadioGroup({
  label, value, onChange, options, required = false, error, horizontal = false,
}: RadioGroupProps) {
  return (
    <div className="w-full">
      <label className="input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div
        className={`flex gap-2 ${horizontal ? 'flex-row flex-wrap' : 'flex-col'}`}
      >
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="flex items-start gap-3 p-4 rounded-xl transition-all duration-200 text-left"
              style={{
                background: active ? 'rgba(127,169,255,0.08)' : 'rgba(7,15,60,0.4)',
                border: `1.5px solid ${active ? 'rgba(127,169,255,0.4)' : 'var(--border)'}`,
                boxShadow: active ? '0 0 16px rgba(127,169,255,0.1)' : 'none',
                flex: horizontal ? '1 1 auto' : undefined,
                minWidth: horizontal ? 140 : 'auto',
                cursor: 'pointer',
              }}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5 transition-all duration-200"
                style={{
                  width: 18,
                  height: 18,
                  border: `2px solid ${active ? 'var(--electric)' : 'rgba(127,169,255,0.3)'}`,
                  background: active ? 'var(--electric)' : 'transparent',
                  boxShadow: active ? '0 0 8px rgba(127,169,255,0.4)' : 'none',
                }}
              >
                {active && <Check size={10} color="var(--dark)" strokeWidth={3.5} />}
              </div>
              <div>
                <p style={{
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--electric-bright)' : 'var(--text-secondary)',
                  lineHeight: 1.3,
                }}>
                  {opt.label}
                </p>
                {opt.description && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>
                    {opt.description}
                  </p>
                )}
              </div>
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
