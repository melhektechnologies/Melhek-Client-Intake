import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '@/store/formStore';
import {
  Briefcase, Building, Layers, Target, ListChecks, Palette,
  FileText, Server, Calendar, Lightbulb, ChevronDown, Send,
  Lock, Check, ArrowLeft, AlertTriangle, ExternalLink
} from 'lucide-react';
import gsap from 'gsap';

interface RS {
  id: string;
  icon: React.ElementType;
  title: string;
  step: number;
}

const SECTIONS: RS[] = [
  { id: 'companyInfo', icon: Briefcase, title: 'Company Information', step: 1 },
  { id: 'businessOverview', icon: Building, title: 'Business Overview', step: 2 },
  { id: 'projectType', icon: Layers, title: 'Project Type', step: 3 },
  { id: 'projectGoals', icon: Target, title: 'Project Goals', step: 4 },
  { id: 'requiredFeatures', icon: ListChecks, title: 'Required Features', step: 5 },
  { id: 'designPreferences', icon: Palette, title: 'Design Preferences', step: 6 },
  { id: 'contentAvailability', icon: FileText, title: 'Content Availability', step: 7 },
  { id: 'technicalRequirements', icon: Server, title: 'Technical Requirements', step: 8 },
  { id: 'timelineBudget', icon: Calendar, title: 'Timeline & Budget', step: 9 },
  { id: 'strategicIntelligence', icon: Lightbulb, title: 'Strategic Intelligence', step: 10 },
];

const PT_LABELS: Record<string, string> = {
  website: 'Website', ecommerce: 'E-commerce', hotel: 'Hotel System',
  restaurant: 'Restaurant', 'mobile-app': 'Mobile App', erp: 'ERP',
  crm: 'CRM', 'ai-chatbot': 'AI Chatbot', 'ai-automation': 'AI Automation',
  booking: 'Booking System', inventory: 'Inventory', custom: 'Custom Software', other: 'Other',
};

const DS_LABELS: Record<string, string> = {
  'modern-minimalist': 'Modern Minimalist', corporate: 'Corporate Pro',
  creative: 'Creative Bold', luxury: 'Elegant Luxury',
  tech: 'Tech Futuristic', warm: 'Warm Friendly',
  editorial: 'Clean Editorial', playful: 'Playful',
};

function Field({ label, value }: { label: string; value?: string | string[] }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6, letterSpacing: '0.08em' }}>
        {label.toUpperCase()}
      </span>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2">
          {value.map((v, i) => <span key={i} className="tag-pill">{v}</span>)}
        </div>
      ) : (
        <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {value}
        </p>
      )}
    </div>
  );
}

function ReviewCard({ s, expanded, onToggle, onEdit, children }: {
  s: RS; expanded: boolean; onToggle: () => void; onEdit: () => void; children: React.ReactNode;
}) {
  const Icon = s.icon;
  return (
    <div
      className="overflow-hidden transition-all duration-300"
      style={{
        background: expanded ? 'rgba(7,15,60,0.7)' : 'rgba(7,15,60,0.3)',
        border: `1px solid ${expanded ? 'rgba(127,169,255,0.25)' : 'var(--border)'}`,
        borderRadius: 16,
        boxShadow: expanded ? '0 0 30px rgba(127,169,255,0.06)' : 'none',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left transition-all duration-200 p-5"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300"
            style={{
              width: 40, height: 40,
              background: expanded ? 'var(--electric)' : 'rgba(127,169,255,0.08)',
              border: `1px solid ${expanded ? 'transparent' : 'var(--border)'}`,
            }}
          >
            <Icon size={18} color={expanded ? 'var(--dark)' : 'var(--electric-dim)'} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--ice)' }}>
              {s.title}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              SECTION {String(s.step).padStart(2, '0')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--electric-dim)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--electric)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--electric-dim)')}
          >
            <ExternalLink size={12} />
            Edit
          </button>
          <div style={{
            transition: 'transform 0.3s ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          }}>
            <ChevronDown size={18} color="var(--text-tertiary)" />
          </div>
        </div>
      </button>

      {expanded && (
        <div
          className="px-5 pb-6 space-y-6"
          style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function ReviewPage() {
  const { formData, validateStep, clearErrors, setSubmissionId, saveDraft } = useFormStore();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['companyInfo']));
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (pageRef.current) {
      gsap.from(Array.from(pageRef.current.querySelectorAll('[data-card]')), {
        opacity: 0, y: 20, duration: 0.5, stagger: 0.05, ease: 'power2.out',
      });
    }
  }, []);

  const toggle = (id: string) =>
    setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleSubmit = async () => {
    setValidationError(null);
    clearErrors();
    let firstBad = -1;
    for (let i = 1; i <= 10; i++) {
      if (!validateStep(i)) { firstBad = i; break; }
    }
    if (firstBad !== -1) {
      setValidationError(`Step ${firstBad} is incomplete. Please go back and complete it.`);
      return;
    }
    if (!confirmed) { setValidationError('Please confirm the accuracy of your information.'); return; }

    setSubmitting(true);
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    const id = `MT-${year}-${rand}`;
    setSubmissionId(id);
    saveDraft();

    // Submit to Google Sheets via Web App URL
    // Set this URL in your .env file or Vercel Environment Variables: VITE_GOOGLE_SHEET_WEBAPP
    const webAppUrl = import.meta.env.VITE_GOOGLE_SHEET_WEBAPP;
    
    if (webAppUrl) {
      try {
        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          // CRITICAL: Must use text/plain — application/json triggers a CORS
          // preflight OPTIONS request that Google Apps Script cannot respond to,
          // silently killing the POST. text/plain is a "simple request" that
          // goes straight through. The Apps Script body is still valid JSON.
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify({ id, ...formData }),
        });
        // no-cors mode means we can't read the response, but it succeeds silently
      } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
      }
    } else {
      // Fallback artificial delay if no Google Sheet is connected yet
      await new Promise((r) => setTimeout(r, 1800));
    }

    setSubmitting(false);
    navigate(`/success?id=${id}`);
  };

  const ci = formData.companyInfo;
  const bo = formData.businessOverview;
  const pt = formData.projectType;
  const pg = formData.projectGoals;
  const rf = formData.requiredFeatures;
  const dp = formData.designPreferences;
  const ca = formData.contentAvailability;
  const tr = formData.technicalRequirements;
  const tb = formData.timelineBudget;
  const si = formData.strategicIntelligence;

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--dark)' }}>
      {/* Fixed bg grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035]" style={{
        backgroundImage: 'radial-gradient(circle, #7fa9ff 1px, transparent 1px)',
        backgroundSize: '40px 40px', zIndex: 0,
      }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 border-b"
        style={{
          height: 68, background: 'rgba(5,8,22,0.9)',
          backdropFilter: 'blur(20px)', borderColor: 'var(--border)',
        }}
      >
        <img src="/melhek-logo.png" alt="Melhek" className="h-9" />
        <button
          onClick={() => navigate('/step/10')}
          className="flex items-center gap-2 transition-colors"
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--electric)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </nav>

      <main className="relative z-10 py-12 px-4">
        <div ref={pageRef} style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,52px)',
              fontWeight: 800, color: 'var(--ice)', letterSpacing: '-0.03em',
            }}>
              Review Your{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--electric-dim), var(--electric-bright))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Project Brief
              </span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 12 }}>
              Review everything carefully. Once submitted, our engineers begin analysis within 24 hours.
            </p>
            {validationError && (
              <div className="mt-6 flex items-center justify-center gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>
                <AlertTriangle size={16} color="var(--error)" />
                <span style={{ fontSize: 14, color: 'var(--error)', fontWeight: 600 }}>{validationError}</span>
              </div>
            )}
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {/* 1 Company */}
            <div data-card>
              <ReviewCard s={SECTIONS[0]} expanded={expanded.has('companyInfo')} onToggle={() => toggle('companyInfo')} onEdit={() => navigate('/step/1')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Company" value={ci.companyName} />
                  <Field label="Industry" value={ci.industry} />
                  <Field label="Contact" value={ci.contactPerson} />
                  <Field label="Position" value={ci.position} />
                  <Field label="Phone" value={ci.phone} />
                  <Field label="Email" value={ci.email} />
                  <Field label="Address" value={ci.address} />
                  <Field label="Website" value={ci.website} />
                  <Field label="Social Media" value={ci.socialMedia} />
                </div>
              </ReviewCard>
            </div>

            {/* 2 Business */}
            <div data-card>
              <ReviewCard s={SECTIONS[1]} expanded={expanded.has('businessOverview')} onToggle={() => toggle('businessOverview')} onEdit={() => navigate('/step/2')}>
                <Field label="About the Business" value={bo.description} />
                <Field label="Products & Services" value={bo.productsServices} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Target Customers" value={bo.targetCustomers} />
                  <Field label="Geographic Market" value={bo.geographicMarket} />
                </div>
                <Field label="Competitors" value={bo.competitors} />
                <Field label="Business Goals" value={bo.goals} />
              </ReviewCard>
            </div>

            {/* 3 Project Type */}
            <div data-card>
              <ReviewCard s={SECTIONS[2]} expanded={expanded.has('projectType')} onToggle={() => toggle('projectType')} onEdit={() => navigate('/step/3')}>
                <Field label="Solution Types" value={pt.selected.map(s => PT_LABELS[s] || s)} />
                {pt.otherDescription && <Field label="Custom Description" value={pt.otherDescription} />}
              </ReviewCard>
            </div>

            {/* 4 Goals */}
            <div data-card>
              <ReviewCard s={SECTIONS[3]} expanded={expanded.has('projectGoals')} onToggle={() => toggle('projectGoals')} onEdit={() => navigate('/step/4')}>
                <Field label="Purpose" value={pg.why} />
                <Field label="Problem to Solve" value={pg.problem} />
                <Field label="Success Criteria" value={pg.success} />
              </ReviewCard>
            </div>

            {/* 5 Features */}
            <div data-card>
              <ReviewCard s={SECTIONS[4]} expanded={expanded.has('requiredFeatures')} onToggle={() => toggle('requiredFeatures')} onEdit={() => navigate('/step/5')}>
                <Field label="Selected Features" value={rf.selected} />
                {rf.customFeatures && <Field label="Custom Requirements" value={rf.customFeatures} />}
              </ReviewCard>
            </div>

            {/* 6 Design */}
            <div data-card>
              <ReviewCard s={SECTIONS[5]} expanded={expanded.has('designPreferences')} onToggle={() => toggle('designPreferences')} onEdit={() => navigate('/step/6')}>
                <Field label="Design Styles" value={dp.style.map(s => DS_LABELS[s] || s)} />
                <Field label="Brand Colors" value={dp.colors} />
                <Field label="Benchmark Websites" value={dp.exampleWebsites} />
                <div className="flex gap-4 flex-wrap">
                  <span className="tag-pill">Logo Files: {dp.logoFiles.length}</span>
                  <span className="tag-pill">Brand Guidelines: {dp.brandGuidelines.length}</span>
                </div>
              </ReviewCard>
            </div>

            {/* 7 Content */}
            <div data-card>
              <ReviewCard s={SECTIONS[6]} expanded={expanded.has('contentAvailability')} onToggle={() => toggle('contentAvailability')} onEdit={() => navigate('/step/7')}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(['logo','images','videos','productInfo','serviceInfo','companyProfile','testimonials','legalContent'] as const).map((k) => {
                    const item = ca[k];
                    if (!item.checked) return null;
                    return (
                      <div key={k} className="p-3 rounded-lg" style={{ background: 'rgba(127,169,255,0.06)', border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ice)', textTransform: 'capitalize' }}>
                          {k.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        {item.needsHelp && <p style={{ fontSize: 11, color: 'var(--warning)', marginTop: 3 }}>Needs help</p>}
                      </div>
                    );
                  })}
                </div>
                {ca.additionalNotes && <Field label="Notes" value={ca.additionalNotes} />}
              </ReviewCard>
            </div>

            {/* 8 Technical */}
            <div data-card>
              <ReviewCard s={SECTIONS[7]} expanded={expanded.has('technicalRequirements')} onToggle={() => toggle('technicalRequirements')} onEdit={() => navigate('/step/8')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Domain Status" value={tr.domain} />
                  {tr.domainName && <Field label="Domain Name" value={tr.domainName} />}
                  <Field label="Hosting" value={tr.hosting} />
                  {tr.hostingProvider && <Field label="Host Provider" value={tr.hostingProvider} />}
                  <Field label="Email Setup" value={tr.email} />
                </div>
                <Field label="Integrations" value={tr.integrations} />
              </ReviewCard>
            </div>

            {/* 9 Timeline */}
            <div data-card>
              <ReviewCard s={SECTIONS[8]} expanded={expanded.has('timelineBudget')} onToggle={() => toggle('timelineBudget')} onEdit={() => navigate('/step/9')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Launch Date" value={tb.launchDate} />
                  <Field label="Urgency" value={tb.urgency} />
                  <Field label="Investment Range" value={tb.budgetRange} />
                </div>
                {tb.budgetContext && <Field label="Budget Notes" value={tb.budgetContext} />}
              </ReviewCard>
            </div>

            {/* 10 Strategy */}
            <div data-card>
              <ReviewCard s={SECTIONS[9]} expanded={expanded.has('strategicIntelligence')} onToggle={() => toggle('strategicIntelligence')} onEdit={() => navigate('/step/10')}>
                <Field label="Business Challenges" value={si.challenges} />
                <Field label="Manual Processes" value={si.manualProcesses} />
                <Field label="Automation Goals" value={si.automate} />
                <Field label="Growth Plans" value={si.growth} />
                <Field label="Key Bottlenecks" value={si.bottlenecks} />
              </ReviewCard>
            </div>
          </div>

          {/* Submit Block */}
          <div className="mt-12 p-8 rounded-2xl"
            style={{
              background: 'rgba(7,15,60,0.7)',
              border: '1px solid rgba(127,169,255,0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 60px rgba(127,169,255,0.05)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: 'rgba(127,169,255,0.1)', border: '1px solid var(--border)' }}>
                <Lock size={18} color="var(--electric-dim)" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ice)' }}>Encrypted & Confidential</p>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Your information is encrypted and only shared with your assigned project team.</p>
              </div>
            </div>

            <label className="flex gap-4 cursor-pointer items-start">
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-lg mt-0.5 transition-all duration-200"
                style={{
                  width: 22, height: 22,
                  background: confirmed ? 'var(--electric)' : 'transparent',
                  border: `2px solid ${confirmed ? 'var(--electric)' : 'rgba(127,169,255,0.3)'}`,
                  boxShadow: confirmed ? '0 0 10px rgba(127,169,255,0.4)' : 'none',
                }}
              >
                {confirmed && <Check size={13} color="var(--dark)" strokeWidth={3.5} />}
              </div>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="sr-only"
              />
              <span style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6 }}>
                I confirm this information is accurate and reflects our current project requirements.
              </span>
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary btn-submit w-full mt-6 py-5 text-lg"
              style={{ borderRadius: 14, justifyContent: 'center', opacity: confirmed ? 1 : 0.5 }}
            >
              {submitting ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                    <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Transmitting Brief...
                </span>
              ) : (
                <>
                  <Send size={20} />
                  Submit Project Brief
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
