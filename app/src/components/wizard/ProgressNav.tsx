import { Check, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '@/store/formStore';
import { useEffect, useState } from 'react';

const STEP_LABELS = [
  'Company', 'Business', 'Project', 'Goals',
  'Features', 'Design', 'Content', 'Technical',
  'Timeline', 'Strategy'
];

interface ProgressNavProps {
  currentStep: number;
  totalSteps?: number;
}

export function ProgressNav({ currentStep, totalSteps = 10 }: ProgressNavProps) {
  const { saveDraft, lastSaved, isDirty } = useFormStore();
  const navigate = useNavigate();
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (lastSaved) {
      setShowSaved(true);
      const t = setTimeout(() => setShowSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [lastSaved]);

  const progress = (currentStep / totalSteps) * 100;

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(5, 8, 22, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(127,169,255,0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between" style={{ height: 68 }}>

        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src="/melhek-logo.png"
            alt="Melhek Technologies"
            className="h-9 w-auto object-contain"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              const fb = img.nextElementSibling as HTMLElement | null;
              if (fb) fb.style.display = 'flex';
            }}
          />
          <span
            className="hidden items-center gap-2"
            style={{ display: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--electric)', fontSize: 18 }}
          >
            Melhek
          </span>
          {isDirty && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--electric)', animation: 'glow-pulse 2s ease-in-out infinite' }}
              title="Unsaved changes"
            />
          )}
        </div>

        {/* Desktop: Step dots */}
        <div className="hidden lg:flex items-center gap-1">
          {Array.from({ length: totalSteps }, (_, i) => {
            const s = i + 1;
            const done = s < currentStep;
            const active = s === currentStep;
            return (
              <div key={s} className="flex items-center">
                <button
                  type="button"
                  disabled={s > currentStep}
                  onClick={() => s <= currentStep && navigate(`/step/${s}`)}
                  title={STEP_LABELS[i]}
                  className="flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: active ? 32 : 24,
                    height: active ? 32 : 24,
                    background: done
                      ? 'var(--electric-dim)'
                      : active
                      ? 'var(--electric)'
                      : 'transparent',
                    border: `2px solid ${done || active ? 'transparent' : 'rgba(127,169,255,0.25)'}`,
                    boxShadow: active ? '0 0 12px rgba(127,169,255,0.5)' : 'none',
                    cursor: s <= currentStep ? 'pointer' : 'default',
                    opacity: s > currentStep ? 0.4 : 1,
                  }}
                >
                  {done && <Check size={11} color="#fff" strokeWidth={3} />}
                  {active && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--dark)' }}>
                      {s}
                    </span>
                  )}
                </button>
                {s < totalSteps && (
                  <div
                    className="transition-all duration-500"
                    style={{
                      width: 16,
                      height: 1,
                      background: s < currentStep
                        ? 'var(--electric-dim)'
                        : 'rgba(127,169,255,0.15)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Tablet/Mobile: Progress bar + label */}
        <div className="lg:hidden flex-1 mx-4">
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--electric)', fontWeight: 500 }}>
              STEP {currentStep}/{totalSteps} — {STEP_LABELS[currentStep - 1]?.toUpperCase()}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div style={{ height: 3, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                borderRadius: 4,
                background: 'linear-gradient(90deg, var(--electric-dim), var(--electric))',
                boxShadow: '0 0 8px rgba(127,169,255,0.4)',
                transition: 'width 0.5s ease-out',
              }}
            />
          </div>
        </div>

        {/* Save Draft */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={saveDraft}
            className="flex items-center gap-1.5 transition-all duration-200"
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: showSaved ? 'var(--success)' : 'var(--text-tertiary)',
            }}
          >
            {showSaved ? (
              <>
                <Check size={13} strokeWidth={3} />
                <span className="hidden sm:inline">SAVED</span>
              </>
            ) : (
              <>
                <Save size={13} />
                <span className="hidden sm:inline">SAVE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom glow line */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(127,169,255,0.15), transparent)',
      }} />
    </nav>
  );
}
