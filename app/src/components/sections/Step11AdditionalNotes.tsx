import { useFormStore } from '@/store/formStore';
import { TextareaField } from '@/components/wizard/TextareaField';
import { FileText } from 'lucide-react';

export function Step11AdditionalNotes() {
  const { formData, updateField } = useFormStore();
  const d = formData.additionalNotes;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('additionalNotes', k, v);

  return (
    <div className="form-panel">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(127,169,255,0.1)', border: '1px solid rgba(127,169,255,0.2)' }}>
            <FileText size={20} style={{ color: 'var(--electric)' }} />
          </div>
          <span className="step-badge">Section 11</span>
        </div>
        <h2 className="section-title">Additional Notes</h2>
        <p className="section-subtitle">
          Please share any other details, requirements, or unique context that can help us prepare
          our analysis. There is no detail too small.
        </p>
        <div className="glow-line mt-6" />
      </div>

      <div className="space-y-6">
        <TextareaField
          label="Additional Details & Notes"
          placeholder="Feel free to write anything else that may help us understand your business, current workflows, or software expectations. E.g., custom integrations needed, hardware choices, legacy data formats, or external auditor requirements."
          value={d.notes}
          onChange={v => f('notes', v)}
          rows={8}
        />
      </div>
    </div>
  );
}
