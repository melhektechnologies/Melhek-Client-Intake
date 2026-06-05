import { useState } from 'react';
import { useFormStore } from '@/store/formStore';
import { FeatureChecklist } from '@/components/wizard/FeatureChecklist';
import { TextareaField } from '@/components/wizard/TextareaField';
import { ChevronDown } from 'lucide-react';

const FEATURE_CATEGORIES = [
  {
    id: 'auth', label: 'User Authentication & Access',
    color: 'rgba(127,169,255,0.1)',
    features: [
      { id: 'auth-register', label: 'User Registration & Login' },
      { id: 'auth-social', label: 'Social Login (Google, Facebook)' },
      { id: 'auth-roles', label: 'Role-Based Permissions' },
      { id: 'auth-2fa', label: 'Two-Factor Authentication' },
      { id: 'auth-sso', label: 'Single Sign-On (SSO)' },
    ],
  },
  {
    id: 'ecom', label: 'eCommerce & Payments',
    color: 'rgba(90,240,176,0.08)',
    features: [
      { id: 'ecom-cart', label: 'Shopping Cart & Checkout' },
      { id: 'ecom-payment', label: 'Online Payments (Stripe, PayPal)' },
      { id: 'ecom-local', label: 'Local Payment (TeleBirr, CBE, Amole)' },
      { id: 'ecom-subscriptions', label: 'Subscriptions / Recurring Billing' },
      { id: 'ecom-coupons', label: 'Promo Codes & Discounts' },
      { id: 'ecom-invoices', label: 'Automated Invoicing' },
    ],
  },
  {
    id: 'content', label: 'Content & CMS',
    color: 'rgba(255,209,102,0.06)',
    features: [
      { id: 'cms-blog', label: 'Blog / News System' },
      { id: 'cms-editor', label: 'Rich Text / Page Builder' },
      { id: 'cms-media', label: 'Media Library (Images, Videos)' },
      { id: 'cms-multilang', label: 'Multi-Language Support' },
      { id: 'cms-seo', label: 'SEO Management Tools' },
    ],
  },
  {
    id: 'data', label: 'Analytics & Reporting',
    color: 'rgba(127,169,255,0.06)',
    features: [
      { id: 'data-dashboard', label: 'Admin Dashboard' },
      { id: 'data-analytics', label: 'Built-in Analytics' },
      { id: 'data-exports', label: 'Export Reports (Excel, PDF)' },
      { id: 'data-realtime', label: 'Real-Time Data & KPIs' },
      { id: 'data-custom', label: 'Custom Report Builder' },
    ],
  },
  {
    id: 'comm', label: 'Communication & Notifications',
    color: 'rgba(90,240,176,0.06)',
    features: [
      { id: 'comm-email', label: 'Email Notifications & Templates' },
      { id: 'comm-sms', label: 'SMS Alerts' },
      { id: 'comm-push', label: 'Push Notifications' },
      { id: 'comm-chat', label: 'Live Chat / Messaging' },
      { id: 'comm-whatsapp', label: 'WhatsApp Integration' },
    ],
  },
  {
    id: 'ai', label: 'AI & Automation',
    color: 'rgba(127,169,255,0.08)',
    features: [
      { id: 'ai-chatbot', label: 'AI Chatbot / Assistant' },
      { id: 'ai-recommend', label: 'AI Recommendations' },
      { id: 'ai-search', label: 'Smart Search' },
      { id: 'ai-ocr', label: 'OCR / Document Intelligence' },
      { id: 'ai-workflow', label: 'Workflow Automation' },
    ],
  },
  {
    id: 'ops', label: 'Operations & Management',
    color: 'rgba(255,209,102,0.05)',
    features: [
      { id: 'ops-booking', label: 'Booking / Reservations' },
      { id: 'ops-inventory', label: 'Inventory Management' },
      { id: 'ops-hr', label: 'HR & Staff Management' },
      { id: 'ops-pos', label: 'Point of Sale (POS)' },
      { id: 'ops-crm', label: 'Customer Relationship Tools' },
      { id: 'ops-tasks', label: 'Task & Project Management' },
    ],
  },
  {
    id: 'infra', label: 'Platform & Infrastructure',
    color: 'rgba(127,169,255,0.04)',
    features: [
      { id: 'infra-api', label: 'REST API / GraphQL' },
      { id: 'infra-mobile', label: 'Mobile App (iOS & Android)' },
      { id: 'infra-pwa', label: 'Progressive Web App (PWA)' },
      { id: 'infra-cdn', label: 'CDN & Performance Optimization' },
      { id: 'infra-backup', label: 'Automated Backups' },
      { id: 'infra-security', label: 'Advanced Security & Compliance' },
    ],
  },
];

export function Step5RequiredFeatures() {
  const { formData, updateField, errors } = useFormStore();
  const rf = formData.requiredFeatures;
  const [openCats, setOpenCats] = useState<Set<string>>(new Set(['auth']));

  const toggleCat = (id: string) => {
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFeature = (id: string) => {
    const next = rf.selected.includes(id)
      ? rf.selected.filter((f) => f !== id)
      : [...rf.selected, id];
    updateField('requiredFeatures', 'selected', next);
  };

  const selectedCount = rf.selected.length;

  return (
    <div className="form-panel">
      <span className="step-badge">Step 05 / 10</span>
      <div className="flex items-start justify-between mt-4 flex-wrap gap-3">
        <div>
          <h2 className="section-title">Required Features</h2>
          <p className="section-subtitle">Select every feature you need. Don't worry about over-selecting.</p>
        </div>
        {selectedCount > 0 && (
          <div
            className="px-4 py-2 rounded-xl flex-shrink-0"
            style={{
              background: 'rgba(127,169,255,0.1)',
              border: '1px solid rgba(127,169,255,0.3)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--electric)',
            }}
          >
            {selectedCount} selected
          </div>
        )}
      </div>

      {errors['requiredFeatures.selected'] && (
        <div className="error-message mt-4">{errors['requiredFeatures.selected']}</div>
      )}

      <div className="mt-6 space-y-3">
        {FEATURE_CATEGORIES.map((cat) => {
          const isOpen = openCats.has(cat.id);
          const catSelected = cat.features.filter((f) => rf.selected.includes(f.id)).length;

          return (
            <div
              key={cat.id}
              style={{
                background: isOpen ? cat.color : 'rgba(7,15,60,0.3)',
                border: `1px solid ${isOpen ? 'rgba(127,169,255,0.2)' : 'var(--border)'}`,
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'background 0.25s, border-color 0.25s',
              }}
            >
              <button
                type="button"
                onClick={() => toggleCat(cat.id)}
                className="w-full flex items-center justify-between px-5 py-4"
                style={{ cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}
              >
                <div className="flex items-center gap-3">
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 15,
                    fontWeight: 700,
                    color: isOpen ? 'var(--ice)' : 'var(--text-secondary)',
                  }}>
                    {cat.label}
                  </span>
                  {catSelected > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: 'var(--electric)',
                        color: 'var(--dark)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {catSelected}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={18}
                  color="var(--text-tertiary)"
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    flexShrink: 0,
                  }}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {cat.features.map((f) => (
                    <FeatureChecklist
                      key={f.id}
                      id={f.id}
                      label={f.label}
                      checked={rf.selected.includes(f.id)}
                      onToggle={() => toggleFeature(f.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <TextareaField
          label="Additional Features Not Listed"
          name="customFeatures"
          value={rf.customFeatures}
          onChange={(v) => updateField('requiredFeatures', 'customFeatures', v)}
          placeholder="Describe any specific features, integrations, or capabilities not covered above..."
          optional minHeight={100}
        />
      </div>
    </div>
  );
}
