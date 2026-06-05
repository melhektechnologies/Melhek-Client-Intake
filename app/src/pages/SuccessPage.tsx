import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Copy, Check, ArrowRight, Mail } from 'lucide-react';
import gsap from 'gsap';

export function SuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id') || 'MT-2025-XXXXX';
  const svgPath = useRef<SVGPathElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState('');
  const [copied, setCopied] = useState(false);

  // SVG checkmark draw
  useEffect(() => {
    if (!svgPath.current) return;
    const len = svgPath.current.getTotalLength();
    gsap.set(svgPath.current, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(svgPath.current, { strokeDashoffset: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' });
  }, []);

  // Ring entrance + pulse
  useEffect(() => {
    if (!ringRef.current) return;
    gsap.fromTo(ringRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, delay: 0.1, ease: 'back.out(1.7)' }
    );
    gsap.to(ringRef.current, {
      scale: 1.04, duration: 2.5, delay: 1.2,
      ease: 'sine.inOut', repeat: -1, yoyo: true,
    });
  }, []);

  // Particle burst
  useEffect(() => {
    if (!confettiRef.current) return;
    const container = confettiRef.current;
    const colors = ['#7fa9ff', '#afc8ff', '#5af0b0', '#f4f7ff', '#4a7adc'];
    const timer = setTimeout(() => {
      for (let i = 0; i < 70; i++) {
        const p = document.createElement('div');
        const sz = Math.random() * 7 + 2;
        p.style.cssText = `
          position:absolute; width:${sz}px; height:${sz}px;
          background:${colors[Math.floor(Math.random() * colors.length)]};
          border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
          left:50%; top:50%; pointer-events:none; z-index:99;
        `;
        container.appendChild(p);
        const ang = (Math.random() * 360 * Math.PI) / 180;
        const vel = 120 + Math.random() * 220;
        gsap.to(p, {
          x: Math.cos(ang) * vel,
          y: Math.sin(ang) * vel - 120,
          rotation: Math.random() * 720,
          opacity: 0,
          duration: 1.4 + Math.random() * 0.8,
          ease: 'power3.out',
          onComplete: () => p.remove(),
        });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i <= id.length) { setTyped(id.substring(0, i)); i++; }
      else clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, [id]);

  // Entrance sequence
  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.3 });
    tl.from('[data-success]', { opacity: 0, y: 20, stagger: 0.12, duration: 0.55, ease: 'power2.out' });
    tl.from('[data-timeline]', { opacity: 0, x: -16, stagger: 0.1, duration: 0.45, ease: 'power2.out' }, '-=0.2');
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRestart = () => {
    localStorage.removeItem('melhek-discovery-draft');
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 overflow-hidden relative"
      style={{ background: 'var(--dark)' }}
    >
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 600, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(127,169,255,0.07) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #7fa9ff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-xl text-center">
        {/* Ring */}
        <div className="relative inline-block mb-10">
          <div ref={confettiRef} className="absolute inset-0" />
          <div
            ref={ringRef}
            className="flex items-center justify-center mx-auto"
            style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'rgba(7,15,60,0.8)',
              border: '3px solid rgba(90,240,176,0.6)',
              boxShadow: '0 0 40px rgba(90,240,176,0.2), inset 0 0 20px rgba(90,240,176,0.05)',
            }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path
                ref={svgPath}
                d="M14 30 L26 42 L46 18"
                stroke="var(--success)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Logo */}
        <div data-success className="mb-6">
          <img src="/melhek-logo.png" alt="Melhek" className="h-10 mx-auto"
            style={{ filter: 'drop-shadow(0 0 12px rgba(127,169,255,0.2))' }} />
        </div>

        <h1 data-success style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,6vw,54px)',
          fontWeight: 800, color: 'var(--ice)', letterSpacing: '-0.03em', lineHeight: 1.1,
        }}>
          Brief{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--success) 0%, #7fffd4 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Transmitted
          </span>
        </h1>

        <p data-success style={{
          fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 14, maxWidth: 420, margin: '14px auto 0',
        }}>
          Your project brief has been received by our engineering intelligence system.
          Expect first contact within <strong style={{ color: 'var(--text-primary)' }}>24 hours</strong>.
        </p>

        {/* ID Card */}
        <div data-success className="mt-10 inline-block">
          <div className="px-10 py-6 rounded-2xl"
            style={{
              background: 'rgba(7,15,60,0.8)',
              border: '1px solid rgba(127,169,255,0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.15em', marginBottom: 10 }}>
              SUBMISSION REFERENCE
            </p>
            <div className="flex items-center gap-4 justify-center">
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 800,
                background: 'linear-gradient(135deg, var(--electric-dim), var(--electric-bright))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                letterSpacing: '0.1em',
              }}>
                {typed}<span style={{ animation: 'glow-pulse 1s infinite', color: 'var(--electric)' }}>_</span>
              </span>
              <button
                onClick={handleCopy}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-tertiary)', borderRadius: 8 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--electric)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div data-success className="mt-10 text-left p-7 rounded-2xl"
          style={{
            background: 'rgba(7,15,60,0.5)',
            border: '1px solid var(--border)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ice)', marginBottom: 20 }}>
            What Happens Next
          </p>
          <div className="space-y-5 relative" style={{ paddingLeft: 40 }}>
            <div style={{ position: 'absolute', left: 14, top: 6, bottom: 20, width: 1, background: 'var(--border)' }} />
            {[
              { n: 1, t: 'Engineering Review', d: 'Our architects analyse your technical requirements and feasibility.' },
              { n: 2, t: 'Strategy Session', d: 'We schedule an intensive discovery call to finalise scope and approach.' },
              { n: 3, t: 'Project Proposal', d: 'You receive a comprehensive roadmap, timeline, and investment structure.' },
            ].map((item) => (
              <div key={item.n} data-timeline className="flex gap-4 items-start relative">
                <div
                  className="absolute flex items-center justify-center rounded-full font-bold"
                  style={{
                    left: -40, width: 28, height: 28,
                    background: 'rgba(7,15,60,0.9)', border: '2px solid var(--border)',
                    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--electric-dim)',
                    zIndex: 10,
                  }}
                >
                  {item.n}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ice)', marginBottom: 3 }}>{item.t}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div data-success className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={() => window.open('https://melhek-technologies.vercel.app', '_blank')}
            className="btn-primary flex-1 py-4"
          >
            Visit Melhek
            <ArrowRight size={18} />
          </button>
          <button onClick={handleRestart} className="btn-secondary flex-1 py-4">
            Start New Project
          </button>
        </div>

        <div data-success className="flex items-center justify-center gap-2 mt-8"
          style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          <Mail size={14} style={{ color: 'var(--electric-dim)' }} />
          Direct:{' '}
          <a href="mailto:melhektechnologies@gmail.com"
            style={{ color: 'var(--electric)', fontWeight: 600 }}>
            melhektechnologies@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
