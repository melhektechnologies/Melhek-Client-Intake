import { useFormStore } from '@/store/formStore';
import { TextareaField } from '@/components/wizard/TextareaField';
import { FormInput } from '@/components/wizard/FormInput';
import { SelectDropdown } from '@/components/wizard/SelectDropdown';

const MARKETS = [
  'Local (City)', 'National', 'East Africa', 'Africa', 'Middle East',
  'Europe', 'North America', 'Global',
];

export function Step2BusinessOverview() {
  const { formData, updateField, errors } = useFormStore();
  const bo = formData.businessOverview;
  const upd = (f: keyof typeof bo) => (v: string) => updateField('businessOverview', f, v);

  return (
    <div className="form-panel">
      <span className="step-badge">Step 02 / 10</span>
      <h2 className="section-title mt-4">Business Overview</h2>
      <p className="section-subtitle">Help us understand your business at a deeper level.</p>

      <div className="mt-8 space-y-6">
        <TextareaField
          label="Describe Your Business" name="description" value={bo.description}
          onChange={upd('description')}
          placeholder="What does your company do? What makes you unique? Share your story..."
          required minHeight={140} maxLength={1000}
          error={errors['businessOverview.description']}
          hint="Minimum 50 characters. Tell us what makes your business distinctive."
        />

        <TextareaField
          label="Core Products & Services" name="productsServices" value={bo.productsServices}
          onChange={upd('productsServices')}
          placeholder="List your main products or services, pricing models, or service tiers..."
          required minHeight={120}
          error={errors['businessOverview.productsServices']}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextareaField
            label="Target Customers" name="targetCustomers" value={bo.targetCustomers}
            onChange={upd('targetCustomers')}
            placeholder="Describe your ideal customer profile, demographics, industries..."
            minHeight={110} optional
          />
          <div className="relative">
            <SelectDropdown
              label="Geographic Market" name="geographicMarket" value={bo.geographicMarket}
              onChange={upd('geographicMarket')} options={MARKETS}
              placeholder="Select primary market" optional
            />
          </div>
        </div>

        <FormInput
          label="Main Competitors" name="competitors" value={bo.competitors}
          onChange={upd('competitors')}
          placeholder="Who are your top 3 competitors? (optional)"
          optional
        />

        <TextareaField
          label="Business Goals (12–18 months)" name="goals" value={bo.goals}
          onChange={upd('goals')}
          placeholder="What are you trying to achieve in the near future? Revenue targets, market expansion, product launches..."
          required minHeight={120}
          error={errors['businessOverview.goals']}
        />
      </div>
    </div>
  );
}
