import { useFormStore } from '@/store/formStore';
import { RadioGroup } from '@/components/wizard/RadioGroup';
import { FormInput } from '@/components/wizard/FormInput';

const DOMAIN_OPTIONS = [
  { value: 'have', label: 'We own a domain', description: 'We have an existing domain name ready to use' },
  { value: 'need-register', label: 'Need to register one', description: 'We need a new domain registered' },
  { value: 'need-transfer', label: 'Need to transfer', description: 'We have a domain elsewhere to move' },
];

const HOSTING_OPTIONS = [
  { value: 'have', label: 'We have hosting', description: 'We already have a hosting provider' },
  { value: 'need', label: 'Need hosting', description: 'Melhek should recommend & set up hosting' },
  { value: 'cloud', label: 'Cloud preferred', description: 'AWS, GCP, Azure, Vercel, Railway...' },
];

const EMAIL_OPTIONS = [
  { value: 'have', label: 'We have business email', description: 'e.g., info@company.com already set up' },
  { value: 'gsuite', label: 'Need Google Workspace', description: 'Professional Gmail for business' },
  { value: 'microsoft', label: 'Need Microsoft 365', description: 'Outlook for business' },
  { value: 'none', label: 'Not needed', description: 'No business email required' },
];

const INTEGRATIONS = [
  'Telebirr', 'Chapa', 'CBE Birr', 'Amole',
  'WhatsApp Business', 'Google Maps', 'Salesforce', 'HubSpot', 
  'Shopify', 'Mailchimp', 'Stripe', 'PayPal', 
  'QuickBooks', 'Slack', 'Custom API', 'Other',
];

export function Step8TechnicalRequirements() {
  const { formData, updateField, errors } = useFormStore();
  const tr = formData.technicalRequirements;
  const upd = (f: keyof typeof tr) => (v: string) => updateField('technicalRequirements', f, v);

  const toggleIntegration = (name: string) => {
    const next = tr.integrations.includes(name)
      ? tr.integrations.filter((i) => i !== name)
      : [...tr.integrations, name];
    updateField('technicalRequirements', 'integrations', next);
  };

  return (
    <div className="form-panel">
      <span className="step-badge">Step 08 / 10</span>
      <h2 className="section-title mt-4">Technical Requirements</h2>
      <p className="section-subtitle">Infrastructure and integration details to architect the right solution.</p>

      <div className="mt-8 space-y-8">
        {/* Domain */}
        <div>
          <RadioGroup
            label="Domain Status"
            value={tr.domain}
            onChange={upd('domain')}
            options={DOMAIN_OPTIONS}
            required
            error={errors['technicalRequirements.domain']}
          />
          {tr.domain === 'have' && (
            <div className="mt-3">
              <FormInput
                label="Your Domain Name" name="domainName" value={tr.domainName}
                onChange={upd('domainName')} placeholder="www.yourcompany.com"
                hint="Enter your existing domain URL"
              />
            </div>
          )}
        </div>

        {/* Hosting */}
        <div>
          <RadioGroup
            label="Hosting Status"
            value={tr.hosting}
            onChange={upd('hosting')}
            options={HOSTING_OPTIONS}
            required
            error={errors['technicalRequirements.hosting']}
          />
          {tr.hosting === 'have' && (
            <div className="mt-3">
              <FormInput
                label="Hosting Provider" name="hostingProvider" value={tr.hostingProvider}
                onChange={upd('hostingProvider')} placeholder="cPanel, SiteGround, DigitalOcean..."
              />
            </div>
          )}
        </div>

        {/* Email */}
        <RadioGroup
          label="Business Email Setup"
          value={tr.email}
          onChange={upd('email')}
          options={EMAIL_OPTIONS}
          required
          error={errors['technicalRequirements.email']}
        />

        {/* Integrations */}
        <div>
          <label className="input-label">Required Integrations</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {INTEGRATIONS.map((name) => {
              const active = tr.integrations.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleIntegration(name)}
                  className="transition-all duration-200 rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    background: active ? 'rgba(127,169,255,0.15)' : 'transparent',
                    border: `1.5px solid ${active ? 'rgba(127,169,255,0.5)' : 'rgba(127,169,255,0.15)'}`,
                    color: active ? 'var(--electric-bright)' : 'var(--text-tertiary)',
                    boxShadow: active ? '0 0 8px rgba(127,169,255,0.15)' : 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {name}
                </button>
              );
            })}
          </div>
          {tr.integrations.includes('Other') && (
            <div className="mt-3">
              <FormInput
                label="Custom Integration" name="customIntegration" value={tr.customIntegration}
                onChange={upd('customIntegration')} placeholder="Describe the system or API you need to connect..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
