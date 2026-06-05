import { Check } from 'lucide-react';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface FeatureChecklistProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
}

export function FeatureChecklist({ label, description, checked, onToggle }: FeatureChecklistProps) {
  const checkRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (checked && checkRef.current) {
      gsap.fromTo(checkRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(2)' }
      );
    }
  }, [checked]);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-start gap-3 text-left transition-all duration-200 rounded-lg p-3 -mx-3 group"
      style={{
        background: checked ? 'rgba(127,169,255,0.05)' : 'transparent',
        border: '1px solid transparent',
        borderColor: checked ? 'rgba(127,169,255,0.15)' : 'transparent',
        cursor: 'pointer',
      }}
    >
      <div
        className="relative flex-shrink-0 flex items-center justify-center rounded-md transition-all duration-200"
        style={{
          width: 20,
          height: 20,
          marginTop: 1,
          background: checked ? 'var(--electric)' : 'transparent',
          border: `2px solid ${checked ? 'var(--electric)' : 'rgba(127,169,255,0.3)'}`,
          boxShadow: checked ? '0 0 8px rgba(127,169,255,0.4)' : 'none',
        }}
      >
        {checked && (
          <div ref={checkRef}>
            <Check size={12} color="var(--dark)" strokeWidth={3.5} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p style={{
          fontSize: 14,
          fontWeight: checked ? 600 : 500,
          color: checked ? 'var(--electric-bright)' : 'var(--text-secondary)',
          transition: 'color 0.2s',
          lineHeight: 1.3,
        }}>
          {label}
        </p>
        {description && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>
    </button>
  );
}
