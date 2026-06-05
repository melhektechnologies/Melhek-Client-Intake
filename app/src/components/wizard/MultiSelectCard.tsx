import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MultiSelectCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  selected: boolean;
  onToggle: () => void;
  compact?: boolean;
}

export function MultiSelectCard({
  icon: Icon, title, description, selected, onToggle, compact = false,
}: MultiSelectCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (selected && cardRef.current) {
      gsap.fromTo(cardRef.current,
        { scale: 1 },
        { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
    }
  }, [selected]);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onToggle}
      className="relative text-left w-full transition-all duration-300"
      style={{
        background: selected ? 'rgba(127,169,255,0.08)' : 'rgba(7,15,60,0.4)',
        border: `1.5px solid ${selected ? 'rgba(127,169,255,0.5)' : 'rgba(127,169,255,0.1)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: compact ? '14px' : '20px',
        cursor: 'pointer',
        boxShadow: selected ? '0 0 20px rgba(127,169,255,0.1), inset 0 1px 0 rgba(127,169,255,0.08)' : 'none',
      }}
    >
      {selected && (
        <div
          className="absolute top-3 right-3 flex items-center justify-center rounded-full"
          style={{ width: 20, height: 20, background: 'var(--electric)', boxShadow: '0 0 8px rgba(127,169,255,0.5)', flexShrink: 0 }}
        >
          <Check size={11} color="var(--dark)" strokeWidth={3} />
        </div>
      )}

      <div
        className="flex items-center justify-center rounded-xl mb-3"
        style={{
          width: compact ? 36 : 44,
          height: compact ? 36 : 44,
          background: selected ? 'rgba(127,169,255,0.15)' : 'rgba(127,169,255,0.06)',
          border: `1px solid ${selected ? 'rgba(127,169,255,0.3)' : 'rgba(127,169,255,0.1)'}`,
        }}
      >
        <Icon size={compact ? 18 : 22} color={selected ? 'var(--electric)' : 'var(--text-tertiary)'} />
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: compact ? 13 : 15,
        fontWeight: 700,
        color: selected ? 'var(--electric-bright)' : 'var(--text-primary)',
        lineHeight: 1.3,
      }}>
        {title}
      </h3>

      {description && !compact && (
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6, lineHeight: 1.5 }}>
          {description}
        </p>
      )}
    </button>
  );
}
