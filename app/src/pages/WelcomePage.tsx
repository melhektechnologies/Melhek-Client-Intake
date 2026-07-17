import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Clock, RefreshCw, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useFormStore } from '@/store/formStore';

const SERVICES = [
  'Retail & Distribution', 'Manufacturing', 'Food & Beverage',
  'Healthcare', 'Wholesale', 'Hospitality',
  'Professional Services', 'Multi-branch Operations',
];

export function WelcomePage() {
  const navigate = useNavigate();
  const { hasDraft, loadDraft } = useFormStore();
  const [showDraft, setShowDraft] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasDraft()) setShowDraft(true);
  }, [hasDraft]);

  // Staggered entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.1 })
        .fromTo('[data-anim="badge"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        .fromTo('[data-anim="title"]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .fromTo('[data-anim="sub"]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .fromTo('[data-anim="tags"]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }, '-=0.2')
        .fromTo('[data-anim="action-btn"]', { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.2')
        .fromTo('[data-anim="trust"]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.2');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Subtle mouse parallax on the grid bg
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const grid = el.querySelector<HTMLElement>('[data-anim="grid"]');
    if (!grid) return;
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      grid.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'var(--dark)',
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      {/* ── Background: grid + glows ── */}
      <div
        data-anim="grid"
        className="absolute inset-0 pointer-events-none"
        style={{ transition: 'transform 0.4s ease-out' }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #7fa9ff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Top-left glow */}
        <div
          className="absolute"
          style={{
            top: '-10%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(127,169,255,0.08) 0%, transparent 70%)',
          }}
        />
        {/* Bottom-right glow */}
        <div
          className="absolute"
          style={{
            bottom: '-10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(1,11,61,0.9) 0%, transparent 70%)',
          }}
        />
        {/* Center orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 600, height: 600,
            background: 'radial-gradient(ellipse, rgba(127,169,255,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Draft Banner ── */}
      {showDraft && (
        <div
          className="mb-8 flex items-center justify-between gap-4 px-5 py-3 rounded-xl max-w-xl w-full mx-4"
          style={{
            background: 'rgba(127,169,255,0.08)',
            border: '1px solid rgba(127,169,255,0.25)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Saved draft found.</strong> Resume where you left off?
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowDraft(false)}
              style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => { loadDraft(); navigate('/step/1'); }}
              style={{
                fontSize: 12, fontWeight: 700, color: 'var(--electric)', cursor: 'pointer',
                background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              Resume <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 flex flex-col items-center">

        {/* Logo */}
        <div className="mb-8">
          <img
            src="/melhek-logo.png"
            alt="Melhek Technologies"
            className="h-14 mx-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 20px rgba(127,169,255,0.2))' }}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              const fb = img.nextElementSibling as HTMLElement | null;
              if (fb) fb.style.display = 'block';
            }}
          />
          <span
            style={{
              display: 'none',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 28,
              background: 'linear-gradient(135deg, var(--electric), var(--steel))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            MELHEK
          </span>
        </div>

        {/* Badge */}
        <div data-anim="badge" className="mb-6">
          <span className="step-badge">Business Discovery & Requirements Assessment</span>
        </div>

        {/* Title */}
        <h1
          data-anim="title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--ice)',
          }}
        >
          Understand Your{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--electric-dim) 0%, var(--electric-bright) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Business
          </span>
          {'. '}Engineer the{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--electric-dim) 0%, var(--electric-bright) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Right Solution
          </span>
          {'.'}
        </h1>

        {/* Subtitle */}
        <p
          data-anim="sub"
          style={{
            fontSize: 17,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 580,
            margin: '20px auto 0',
          }}
        >
          Complete this guided discovery assessment to help us deeply analyze your operations.
          Our expert consultants and engineers will use your answers to structure the perfect digital workflow recommendation.
        </p>

        {/* Service chips */}
        <div data-anim="tags" className="flex flex-wrap gap-2 justify-center mt-8">
          {SERVICES.map((s) => (
            <span key={s} className="tag-pill">{s}</span>
          ))}
        </div>

        {/* CTA */}
        <button
          data-anim="action-btn"
          onClick={() => navigate('/step/1')}
          className="btn-primary mt-10 px-12 py-5 text-lg"
          style={{ borderRadius: 14 }}
        >
          Begin Discovery
          <ArrowRight size={20} />
        </button>

        {/* Trust indicators */}
        <div data-anim="trust" className="flex flex-wrap gap-5 justify-center mt-10">
          {[
            { icon: Shield, text: 'Structured Consulting Process' },
            { icon: Clock, text: '10–15 minutes' },
            { icon: RefreshCw, text: 'Auto-saves progress' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={14} style={{ color: 'var(--electric-dim)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
