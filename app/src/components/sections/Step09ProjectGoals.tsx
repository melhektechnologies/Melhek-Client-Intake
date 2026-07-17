import { useFormStore } from '@/store/formStore';
import { TextareaField } from '@/components/wizard/TextareaField';
import { Target } from 'lucide-react';

export function Step09ProjectGoals() {
  const { formData, updateField, errors } = useFormStore();
  const d = formData.projectGoals;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('projectGoals', k, v);

  return (
    <div className="form-panel">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(127,169,255,0.1)', border: '1px solid rgba(127,169,255,0.2)' }}>
            <Target size={20} style={{ color: 'var(--electric)' }} />
          </div>
          <span className="step-badge">Section 09</span>
        </div>
        <h2 className="section-title">Project Goals</h2>
        <p className="section-subtitle">
          Define the expected business outcomes of this initiative. Focus on quantifiable targets
          and processes you intend to optimize, eliminate, or automate.
        </p>
        <div className="glow-line mt-6" />
      </div>

      <div className="space-y-6">
        <TextareaField
          label="Why are you looking for a solution now?"
          required
          placeholder="Describe the trigger event. What changed in your business that made this project a priority today?"
          value={d.whyNow}
          onChange={v => f('whyNow', v)}
          rows={4}
          error={errors['projectGoals.whyNow']}
        />

        <TextareaField
          label="What would success look like six months after implementation?"
          required
          placeholder="E.g., 'We have matching physical and system stock at 99% accuracy, checkouts take under 30 seconds, and we have live daily profit reports.'"
          value={d.successDefinition}
          onChange={v => f('successDefinition', v)}
          rows={4}
          error={errors['projectGoals.successDefinition']}
        />

        <TextareaField
          label="What are the top three improvements you expect?"
          placeholder="1. Eliminate stock discrepancies&#10;2. Reduce checkout times by 50%&#10;3. Get reliable, daily profitability reports"
          value={d.topImprovements}
          onChange={v => f('topImprovements', v)}
          rows={3}
        />

        <TextareaField
          label="What manual work do you want to eliminate?"
          placeholder="E.g., manual Excel record entries at night, counting shelves daily to verify stock, paper order slips."
          value={d.manualWorkToEliminate}
          onChange={v => f('manualWorkToEliminate', v)}
          rows={3}
        />

        <TextareaField
          label="If nothing changes, what problems will continue?"
          placeholder="E.g., loss of money due to untracked stock, slow customer checkouts, lack of insight into which products make the most profit."
          value={d.ifNothingChanges}
          onChange={v => f('ifNothingChanges', v)}
          rows={3}
        />
      </div>
    </div>
  );
}
