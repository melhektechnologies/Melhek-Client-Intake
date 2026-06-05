import { useFormStore } from '@/store/formStore';
import { TextareaField } from '@/components/wizard/TextareaField';

export function Step10StrategicIntelligence() {
  const { formData, updateField, errors } = useFormStore();
  const si = formData.strategicIntelligence;
  const upd = (f: keyof typeof si) => (v: string) => updateField('strategicIntelligence', f, v);

  return (
    <div className="form-panel">
      <span className="step-badge">Step 10 / 10</span>
      <h2 className="section-title mt-4">Strategic Business Intelligence</h2>
      <p className="section-subtitle">
        This is where most intake forms stop — but Melhek goes deeper.
        These answers shape the entire engineering strategy.
      </p>

      {/* Highlight box */}
      <div
        className="mt-6 p-5 rounded-xl flex gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(127,169,255,0.06), rgba(1,11,61,0.5))',
          border: '1px solid rgba(127,169,255,0.2)',
        }}
      >
        <div
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl"
          style={{ background: 'rgba(127,169,255,0.12)', border: '1px solid rgba(127,169,255,0.25)' }}
        >
          <span style={{ fontSize: 18 }}>🧠</span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ice)', fontWeight: 700 }}>Why this matters:</strong>{' '}
          Understanding your operational context allows our AI engineering team to design
          systems that don't just work today — they scale with your business for years.
        </p>
      </div>

      <div className="mt-8 space-y-7">
        <TextareaField
          label="Current Business Challenges"
          name="challenges"
          value={si.challenges}
          onChange={upd('challenges')}
          placeholder="What are the biggest obstacles slowing down your business right now? Be honest and specific — this directly shapes our system architecture..."
          required minHeight={140}
          maxLength={1000}
          error={errors['strategicIntelligence.challenges']}
        />

        <TextareaField
          label="Manual Processes & Bottlenecks"
          name="manualProcesses"
          value={si.manualProcesses}
          onChange={upd('manualProcesses')}
          placeholder="What tasks does your team do manually that they wish were automated? (data entry, reporting, follow-ups, approvals, scheduling...)"
          minHeight={130}
          maxLength={800}
          optional
        />

        <TextareaField
          label="Tasks to Automate"
          name="automate"
          value={si.automate}
          onChange={upd('automate')}
          placeholder="If you could automate 3 things tomorrow, what would they be? Describe the workflow, the frequency, and who is responsible for it currently..."
          required minHeight={130}
          maxLength={800}
          error={errors['strategicIntelligence.automate']}
        />

        <TextareaField
          label="Growth Plans (1–3 Years)"
          name="growth"
          value={si.growth}
          onChange={upd('growth')}
          placeholder="Where do you see your business in 1–3 years? New markets, new products, new customers? We'll design the system to support your scale..."
          minHeight={120}
          maxLength={800}
          optional
        />

        <TextareaField
          label="Biggest Current Bottlenecks"
          name="bottlenecks"
          value={si.bottlenecks}
          onChange={upd('bottlenecks')}
          placeholder="What is the single biggest thing blocking your business from the next level? People, process, technology, cash flow, visibility...?"
          minHeight={120}
          maxLength={800}
          optional
        />
      </div>
    </div>
  );
}
