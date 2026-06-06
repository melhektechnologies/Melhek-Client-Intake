import { useFormStore } from '@/store/formStore';
import { FormInput } from '@/components/wizard/FormInput';
import { SelectDropdown } from '@/components/wizard/SelectDropdown';

const INDUSTRIES = [
  'Technology', 'Marketing & Advertising', 'Finance & Banking', 
  'Retail & eCommerce', 'Healthcare', 'Hospitality & Tourism', 
  'Professional Services (Legal, Consulting)', 'Manufacturing', 
  'Education', 'Real Estate', 'Logistics & Transport', 
  'Government & NGO', 'Agriculture', 'Construction', 
  'Energy & Utilities', 'Media & Entertainment', 'Other',
];

export function Step1CompanyInfo() {
  const { formData, updateField, errors } = useFormStore();
  const ci = formData.companyInfo;
  const upd = (f: keyof typeof ci) => (v: string) => updateField('companyInfo', f, v);

  return (
    <div className="form-panel">
      <span className="step-badge">Step 01 / 10</span>
      <h2 className="section-title mt-4">Company Information</h2>
      <p className="section-subtitle">Tell us about your organisation so we can tailor our approach.</p>

      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Company Name" name="companyName" value={ci.companyName}
            onChange={upd('companyName')} placeholder="Melhek Technologies"
            required error={errors['companyInfo.companyName']}
          />
          <div className="relative">
            <SelectDropdown
              label="Industry" name="industry" value={ci.industry}
              onChange={upd('industry')} options={INDUSTRIES}
              placeholder="Select your industry" required error={errors['companyInfo.industry']}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Contact Person" name="contactPerson" value={ci.contactPerson}
            onChange={upd('contactPerson')} placeholder="Full name"
            required error={errors['companyInfo.contactPerson']}
          />
          <FormInput
            label="Position / Role" name="position" value={ci.position}
            onChange={upd('position')} placeholder="CEO, CTO, Manager..."
            required error={errors['companyInfo.position']}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Phone Number" name="phone" value={ci.phone}
            onChange={upd('phone')} placeholder="+251 911 00 00 00"
            type="tel" required error={errors['companyInfo.phone']}
          />
          <FormInput
            label="Email Address" name="email" value={ci.email}
            onChange={upd('email')} placeholder="you@company.com"
            type="email" required error={errors['companyInfo.email']}
          />
        </div>

        <FormInput
          label="Physical Address" name="address" value={ci.address}
          onChange={upd('address')} placeholder="Addis Ababa, Ethiopia"
          optional
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Website URL" name="website" value={ci.website}
            onChange={upd('website')} placeholder="https://www.example.com"
            type="url" optional
          />
          <FormInput
            label="Social Media Links" name="socialMedia" value={ci.socialMedia}
            onChange={upd('socialMedia')} placeholder="LinkedIn, Twitter, Instagram..."
            optional
          />
        </div>
      </div>
    </div>
  );
}
