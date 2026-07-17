import { useFormStore } from '@/store/formStore';
import { FormInput } from '@/components/wizard/FormInput';
import { SelectDropdown } from '@/components/wizard/SelectDropdown';
import { Building2, MapPin, Globe, Users, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Tooltip } from '@/components/wizard/Tooltip';

const INDUSTRIES = [
  'Retail & General Trade', 'Wholesale & Distribution', 'Food & Beverage',
  'Manufacturing', 'Healthcare & Pharmacy', 'Hospitality & Hotel',
  'Construction & Real Estate', 'Professional Services', 'Education & Training',
  'Technology', 'Agriculture', 'Logistics & Transport', 'Other',
];

const BUSINESS_TYPES = [
  { value: 'sole-proprietorship', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'private-limited', label: 'Private Limited Company (PLC)' },
  { value: 'share-company', label: 'Share Company (SC)' },
  { value: 'ngo', label: 'NGO / Non-Profit' },
  { value: 'government', label: 'Government / Public Entity' },
  { value: 'other', label: 'Other' },
];

export function Step01BusinessInfo() {
  const { formData, updateField, errors } = useFormStore();
  const d = formData.businessInfo;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('businessInfo', k, v);

  return (
    <div className="form-panel">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(127,169,255,0.1)', border: '1px solid rgba(127,169,255,0.2)' }}>
            <Building2 size={20} style={{ color: 'var(--electric)' }} />
          </div>
          <div>
            <span className="step-badge">Section 01</span>
          </div>
        </div>
        <h2 className="section-title">Business Information</h2>
        <p className="section-subtitle">
          Provide your organization's primary details. This information helps us understand
          the context of your business and ensures accurate communication throughout the engagement.
        </p>
        <div className="glow-line mt-6" />
      </div>

      {/* Business Identity */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Business Name"
            required
            placeholder="e.g. Sunrise Trading PLC"
            value={d.businessName}
            onChange={v => f('businessName', v)}
            error={errors['businessInfo.businessName']}
          />
          <SelectDropdown
            label="Industry"
            info="Select the primary sector your business operates in. If multiple apply, choose your highest-revenue sector."
            required
            options={INDUSTRIES.map(i => ({ value: i, label: i }))}
            value={d.industry}
            onChange={v => f('industry', v)}
            placeholder="Select your industry"
            error={errors['businessInfo.industry']}
          />
        </div>

        {/* Business Type */}
        <div>
          <label className="input-label flex items-center">
            <span>Business Type</span>
            <Tooltip text="The legal structure of your business affects how we design reporting and tax compliance features." />
            <span className="required ml-1">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BUSINESS_TYPES.map(bt => {
              const active = d.businessType === bt.value;
              return (
                <button
                  key={bt.value}
                  type="button"
                  onClick={() => f('businessType', bt.value)}
                  className="text-left p-3.5 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? 'rgba(127,169,255,0.12)' : 'rgba(7,15,60,0.4)',
                    border: `1.5px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
                    boxShadow: active ? '0 0 14px rgba(127,169,255,0.1)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                      background: active ? 'var(--electric)' : 'transparent',
                      border: `2px solid ${active ? 'var(--electric)' : 'rgba(127,169,255,0.3)'}`,
                      boxShadow: active ? '0 0 8px rgba(127,169,255,0.5)' : 'none',
                    }} />
                    <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? 'var(--ice)' : 'var(--text-secondary)' }}>
                      {bt.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {errors['businessInfo.businessType'] && (
            <p className="error-message">⚠ {errors['businessInfo.businessType']}</p>
          )}
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Number of Branches"
            info="Include your main headquarters, all retail locations, and any separate warehouses or storage facilities."
            placeholder="e.g. 3"
            value={d.branches}
            onChange={v => f('branches', v)}
          />
          <FormInput
            label="Business Address"
            placeholder="City, Sub-city, Woreda / Street"
            value={d.address}
            onChange={v => f('address', v)}
            icon={<MapPin size={15} style={{ color: 'var(--electric-dim)' }} />}
          />
        </div>

        {/* Online Presence */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, letterSpacing: '0.01em' }}>
            Online Presence <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Website"
              placeholder="www.yourbusiness.com"
              value={d.website}
              onChange={v => f('website', v)}
              icon={<Globe size={15} style={{ color: 'var(--electric-dim)' }} />}
            />
            <FormInput
              label="Facebook Page"
              placeholder="facebook.com/yourpage"
              value={d.facebook}
              onChange={v => f('facebook', v)}
              icon={<Facebook size={15} style={{ color: 'var(--electric-dim)' }} />}
            />
            <FormInput
              label="Instagram"
              placeholder="@yourhandle"
              value={d.instagram}
              onChange={v => f('instagram', v)}
              icon={<Instagram size={15} style={{ color: 'var(--electric-dim)' }} />}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users size={14} style={{ color: 'var(--electric-dim)' }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>Primary Contact</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              label="Contact Person"
              required
              placeholder="Full name"
              value={d.contactPerson}
              onChange={v => f('contactPerson', v)}
              error={errors['businessInfo.contactPerson']}
            />
            <FormInput
              label="Position / Title"
              required
              placeholder="e.g. General Manager, Owner"
              value={d.position}
              onChange={v => f('position', v)}
              error={errors['businessInfo.position']}
            />
            <FormInput
              label="Phone Number"
              required
              placeholder="+251 9XX XXX XXX"
              value={d.phone}
              onChange={v => f('phone', v)}
              error={errors['businessInfo.phone']}
              icon={<Phone size={15} style={{ color: 'var(--electric-dim)' }} />}
            />
            <FormInput
              label="Email Address"
              required
              placeholder="contact@yourbusiness.com"
              value={d.email}
              onChange={v => f('email', v)}
              error={errors['businessInfo.email']}
              icon={<Mail size={15} style={{ color: 'var(--electric-dim)' }} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
