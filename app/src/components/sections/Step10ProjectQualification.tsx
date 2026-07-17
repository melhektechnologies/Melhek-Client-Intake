import { useFormStore } from '@/store/formStore';
import { FormInput } from '@/components/wizard/FormInput';
import { TextareaField } from '@/components/wizard/TextareaField';
import { ShieldCheck } from 'lucide-react';

const URGENCY_OPTIONS = [
  { value: 'immediately', label: 'Immediately (Crucial need)' },
  { value: '1-month', label: 'Within 1 Month' },
  { value: '1-3-months', label: '1 – 3 Months' },
  { value: 'researching', label: 'Just Researching / Planning' },
];

const DECISION_MAKERS = [
  { value: 'owner', label: 'Business Owner' },
  { value: 'partners', label: 'Managing Partners' },
  { value: 'manager', label: 'General Manager' },
  { value: 'board', label: 'Board of Directors' },
];

const BUDGET_STATUS = [
  { value: 'yes', label: 'Yes — Budget has been approved' },
  { value: 'no', label: 'No — Currently building the business case' },
  { value: 'not-yet', label: 'Not Yet — Open to guidance on typical pricing' },
];

const VENDOR_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export function Step10ProjectQualification() {
  const { formData, updateField, errors } = useFormStore();
  const d = formData.projectQualification;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('projectQualification', k, v);

  const renderRadio = (
    field: keyof typeof d,
    options: { value: string; label: string }[],
    colClass = 'grid-cols-2'
  ) => (
    <div className={`grid ${colClass} gap-3`}>
      {options.map(opt => {
        const active = d[field] === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => f(field, active ? '' : opt.value)}
            className="text-left p-3.5 rounded-xl transition-all duration-200"
            style={{
              background: active ? 'rgba(127,169,255,0.12)' : 'rgba(7,15,60,0.4)',
              border: `1.5px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                background: active ? 'var(--electric)' : 'transparent',
                border: `2px solid ${active ? 'var(--electric)' : 'rgba(127,169,255,0.3)'}`,
              }} />
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? 'var(--ice)' : 'var(--text-secondary)' }}>
                {opt.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="form-panel">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(127,169,255,0.1)', border: '1px solid rgba(127,169,255,0.2)' }}>
            <ShieldCheck size={20} style={{ color: 'var(--electric)' }} />
          </div>
          <span className="step-badge">Section 10</span>
        </div>
        <h2 className="section-title">Project Qualification</h2>
        <p className="section-subtitle">
          Help us align our proposal timeline, resources, and pricing strategies with your budget constraints
          and internal procurement protocols.
        </p>
        <div className="glow-line mt-6" />
      </div>

      <div className="space-y-6">
        {/* Urgency */}
        <div>
          <label className="input-label">Project Urgency <span className="required">*</span></label>
          {renderRadio('urgency', URGENCY_OPTIONS, 'grid-cols-1 sm:grid-cols-2')}
          {errors['projectQualification.urgency'] && (
            <p className="error-message">⚠ {errors['projectQualification.urgency']}</p>
          )}
        </div>

        {/* Decision Maker */}
        <div>
          <label className="input-label">Who is the final decision maker? <span className="required">*</span></label>
          {renderRadio('decisionMaker', DECISION_MAKERS, 'grid-cols-2 sm:grid-cols-4')}
          {errors['projectQualification.decisionMaker'] && (
            <p className="error-message">⚠ {errors['projectQualification.decisionMaker']}</p>
          )}
        </div>

        {/* Budget status */}
        <div>
          <label className="input-label">Has a budget already been allocated? <span className="required">*</span></label>
          {renderRadio('budgetAllocated', BUDGET_STATUS, 'grid-cols-1 sm:grid-cols-3')}
          {errors['projectQualification.budgetAllocated'] && (
            <p className="error-message">⚠ {errors['projectQualification.budgetAllocated']}</p>
          )}
        </div>

        {/* Expected investment (optional) */}
        <div>
          <FormInput
            label="What investment range were you expecting? (optional)"
            placeholder="E.g., ETB 100,000 – 250,000, open to proposals"
            value={d.investmentRange}
            onChange={v => f('investmentRange', v)}
          />
        </div>

        {/* Spoken with other vendors */}
        <div>
          <label className="input-label">Have you spoken with another software company?</label>
          {renderRadio('spokenToVendor', VENDOR_OPTIONS, 'grid-cols-2')}
        </div>

        {/* Conditional vendor proposal */}
        {d.spokenToVendor === 'yes' && (
          <TextareaField
            label="What did they propose? (optional)"
            placeholder="Briefly describe what they proposed, why it was or was not suitable, or typical pricing they mentioned."
            value={d.vendorProposal}
            onChange={v => f('vendorProposal', v)}
            rows={3}
          />
        )}
      </div>
    </div>
  );
}
