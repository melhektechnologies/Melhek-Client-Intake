import { useFormStore } from '@/store/formStore';
import { FormInput } from '@/components/wizard/FormInput';
import { SegmentedControl } from '@/components/wizard/SegmentedControl';
import { RangeSlider } from '@/components/wizard/RangeSlider';
import { TextareaField } from '@/components/wizard/TextareaField';

const URGENCY_LEVELS = ['Flexible', 'Soon', 'Urgent', 'Critical'];

// Min date = 2 weeks from today
const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split('T')[0];
};

export function Step9TimelineBudget() {
  const { formData, updateField, errors } = useFormStore();
  const tb = formData.timelineBudget;
  const upd = (f: keyof typeof tb) => (v: string) => updateField('timelineBudget', f, v);

  return (
    <div className="form-panel">
      <span className="step-badge">Step 09 / 10</span>
      <h2 className="section-title mt-4">Timeline & Budget</h2>
      <p className="section-subtitle">Understanding your timeline and investment helps us propose the right scope.</p>

      <div className="mt-8 space-y-8">
        {/* Launch Date */}
        <FormInput
          label="Desired Launch Date"
          name="launchDate"
          value={tb.launchDate}
          onChange={upd('launchDate')}
          type="date"
          required
          error={errors['timelineBudget.launchDate']}
          hint={`Must be at least 2 weeks from today (${getMinDate()})`}
        />

        {/* Urgency */}
        <SegmentedControl
          label="Urgency Level"
          value={tb.urgency}
          onChange={upd('urgency')}
          options={URGENCY_LEVELS}
          required
          error={errors['timelineBudget.urgency']}
        />

        {/* Urgency details */}
        {tb.urgency && (
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(127,169,255,0.05)',
              border: '1px solid rgba(127,169,255,0.12)',
            }}
          >
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {tb.urgency === 'Flexible' && '✅ Great — a relaxed timeline allows for deep research, iterations, and a polished result.'}
              {tb.urgency === 'Soon' && '📅 Good — we\'ll plan sprints to deliver quality without cutting corners.'}
              {tb.urgency === 'Urgent' && '⚡ Noted — we\'ll assess if rush delivery is feasible. A dedicated team may be allocated.'}
              {tb.urgency === 'Critical' && '🚨 Understood. Our team will evaluate expedited timelines. Additional resourcing may apply.'}
            </p>
          </div>
        )}

        {/* Budget Range */}
        <RangeSlider
          label="Investment Range (USD)"
          value={tb.budgetRange}
          onChange={upd('budgetRange')}
          required
          error={errors['timelineBudget.budgetRange']}
        />

        {/* Budget Context */}
        <TextareaField
          label="Budget Context"
          name="budgetContext"
          value={tb.budgetContext}
          onChange={upd('budgetContext')}
          placeholder="Is this budget fixed, or is there flexibility? Are there phased payment options you prefer? Any financial constraints we should know about?"
          optional minHeight={100}
        />
      </div>
    </div>
  );
}
