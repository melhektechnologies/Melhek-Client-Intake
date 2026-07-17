import { useFormStore } from '@/store/formStore';
import { TextareaField } from '@/components/wizard/TextareaField';
import { GitBranch } from 'lucide-react';

interface WorkflowQuestion {
  key: keyof import('@/types/form').CurrentWorkflow;
  number: string;
  label: string;
  placeholder: string;
}

const WORKFLOW_QUESTIONS: WorkflowQuestion[] = [
  {
    key: 'purchasing',
    number: '01',
    label: 'How are products purchased?',
    placeholder: 'Walk us through the purchase process — who initiates it, how suppliers are selected, how orders are placed, and how payment is made.',
  },
  {
    key: 'stockArrival',
    number: '02',
    label: 'How do products arrive at your business?',
    placeholder: 'Describe what happens when a delivery arrives — who receives it, where it goes, and what paperwork is involved.',
  },
  {
    key: 'stockRecording',
    number: '03',
    label: 'Who records incoming stock, and how?',
    placeholder: 'Is it manual (paper/Excel), or does someone enter it into a system? Who is responsible for this task?',
  },
  {
    key: 'stockUpdates',
    number: '04',
    label: 'How is stock quantity updated after a sale?',
    placeholder: 'Does your POS automatically reduce inventory? Or is it done manually at the end of the day/shift?',
  },
  {
    key: 'salesProcess',
    number: '05',
    label: 'How does a sale happen at the point of sale?',
    placeholder: 'Describe the process from when a customer selects a product to when they pay — include any steps the cashier takes.',
  },
  {
    key: 'receipts',
    number: '06',
    label: 'How are receipts or invoices issued?',
    placeholder: 'Are receipts printed? Sent digitally? Manual? Who handles this and what information is included?',
  },
  {
    key: 'purchaseApprovals',
    number: '07',
    label: 'Who approves purchase orders or restocking requests?',
    placeholder: 'Is there a formal approval chain? Does the owner approve every purchase, or do managers have authority up to a certain amount?',
  },
  {
    key: 'returns',
    number: '08',
    label: 'How are customer returns or exchanges handled?',
    placeholder: 'What is the return process? Who approves it? How is the inventory adjusted? Is there paperwork?',
  },
  {
    key: 'damagedItems',
    number: '09',
    label: 'How are damaged or expired items recorded?',
    placeholder: 'What happens when a product is damaged in the warehouse or found expired on the shelf? Who records it and how?',
  },
  {
    key: 'inventoryCorrections',
    number: '10',
    label: 'How are inventory discrepancies corrected?',
    placeholder: 'If the system shows 50 units but you physically have 47 — what is the process to investigate and correct this?',
  },
  {
    key: 'monthEndCounting',
    number: '11',
    label: 'How do you conduct month-end stock counting?',
    placeholder: 'Who participates, how long does it take, how is it recorded, and what happens with the results?',
  },
  {
    key: 'yearEndCounting',
    number: '12',
    label: 'How do you conduct year-end stock counting?',
    placeholder: 'Is it different from month-end? Are external auditors involved? How are discrepancies resolved?',
  },
];

export function Step03CurrentWorkflow() {
  const { formData, updateField } = useFormStore();
  const d = formData.currentWorkflow;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('currentWorkflow', k, v);

  return (
    <div className="form-panel">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(127,169,255,0.1)', border: '1px solid rgba(127,169,255,0.2)' }}>
            <GitBranch size={20} style={{ color: 'var(--electric)' }} />
          </div>
          <span className="step-badge">Section 03</span>
        </div>
        <h2 className="section-title">Current Workflow</h2>
        <p className="section-subtitle">
          This is the most important section of the assessment. Describe your operations in your own words — there are no right or wrong answers.
          The more detail you provide, the more precisely we can engineer your solution.
        </p>
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          borderRadius: 10,
          background: 'rgba(127,169,255,0.05)',
          border: '1px solid rgba(127,169,255,0.15)',
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}>
          💡 <strong style={{ color: 'var(--electric-dim)' }}>Tip:</strong> You may leave questions blank if they do not apply to your business.
          Focus on the areas where you see the most complexity or confusion.
        </div>
        <div className="glow-line mt-6" />
      </div>

      <div className="space-y-8">
        {WORKFLOW_QUESTIONS.map((q) => (
          <div key={q.key} className="consulting-q">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center rounded-lg"
                style={{
                  width: 36, height: 36,
                  background: 'rgba(127,169,255,0.08)',
                  border: '1px solid rgba(127,169,255,0.2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--electric)',
                }}>
                {q.number}
              </div>
              <div className="flex-1">
                <TextareaField
                  label={q.label}
                  placeholder={q.placeholder}
                  value={d[q.key]}
                  onChange={v => f(q.key, v)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
