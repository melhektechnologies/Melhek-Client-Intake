import { useFormStore } from '@/store/formStore';
import { TextareaField } from '@/components/wizard/TextareaField';

export function Step4ProjectGoals() {
  const { formData, updateField, errors } = useFormStore();
  const pg = formData.projectGoals;
  const upd = (f: keyof typeof pg) => (v: string) => updateField('projectGoals', f, v);

  return (
    <div className="form-panel">
      <span className="step-badge">Step 04 / 10</span>
      <h2 className="section-title mt-4">Project Goals</h2>
      <p className="section-subtitle">The clearer you are here, the better we engineer the solution.</p>

      <div className="mt-8 space-y-6">
        <div
          className="p-5 rounded-xl"
          style={{
            background: 'rgba(127,169,255,0.04)',
            border: '1px solid rgba(127,169,255,0.1)',
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            💡 <strong style={{ color: 'var(--text-primary)' }}>Pro tip:</strong>{' '}
            Be specific and honest. Vague goals lead to vague outcomes. The most successful
            projects start with crystal-clear mission statements.
          </p>
        </div>

        <TextareaField
          label="Why do you need this project?"
          name="why"
          value={pg.why}
          onChange={upd('why')}
          placeholder="What is the primary reason you are investing in this project? What triggered the decision to build this now?"
          required minHeight={130}
          maxLength={800}
          error={errors['projectGoals.why']}
        />

        <TextareaField
          label="What problem should it solve?"
          name="problem"
          value={pg.problem}
          onChange={upd('problem')}
          placeholder="Describe the current pain points, inefficiencies, or bottlenecks this project should address..."
          required minHeight={130}
          maxLength={800}
          error={errors['projectGoals.problem']}
        />

        <TextareaField
          label="What outcome makes this project a success?"
          name="success"
          value={pg.success}
          onChange={upd('success')}
          placeholder="How will you measure success? Increased revenue, reduced manual work, new customers, faster operations..."
          required minHeight={130}
          maxLength={800}
          error={errors['projectGoals.success']}
        />
      </div>
    </div>
  );
}
