import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';
import gsap from 'gsap';

interface DropdownOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  label: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | DropdownOption)[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  optional?: boolean;
  info?: string;
}

export function SelectDropdown({
  label, name, value, onChange, options,
  placeholder = 'Select an option', required = false, error, info
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputId = name || label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && menuRef.current) {
      gsap.fromTo(menuRef.current,
        { opacity: 0, y: -8, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
      );
    }
  }, [open]);

  // Normalize options to { value, label }
  const normalizedOptions: DropdownOption[] = options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : '';

  return (
    <div className="w-full relative" ref={containerRef}>
      <label htmlFor={inputId} className="input-label flex items-center">
        <span>{label}</span>
        {info && <Tooltip text={info} />}
        {required && <span className="required ml-1">*</span>}
      </label>

      <button
        id={inputId}
        type="button"
        onClick={() => setOpen(!open)}
        className={`input-field flex items-center justify-between text-left ${error ? 'error' : ''}`}
        style={{ color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}
      >
        <span style={{ fontWeight: value ? 500 : 400 }}>{displayLabel || placeholder}</span>
        <ChevronDown
          size={16}
          style={{
            color: 'var(--text-tertiary)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute z-[200] mt-2 w-full overflow-y-auto"
          style={{
            background: 'rgba(7, 15, 60, 0.97)',
            border: '1px solid var(--border-hover)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(127,169,255,0.1)',
            backdropFilter: 'blur(20px)',
            maxHeight: 260,
            left: 0,
            right: 0,
          }}
        >
          <div className="p-1.5">
            {normalizedOptions.map((opt) => {
              const active = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-150"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: 'var(--font-sans)',
                    color: active ? 'var(--electric)' : 'var(--text-secondary)',
                    background: active ? 'rgba(127,169,255,0.08)' : 'transparent',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(127,169,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span>{opt.label}</span>
                  {active && <Check size={14} color="var(--electric)" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>
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
