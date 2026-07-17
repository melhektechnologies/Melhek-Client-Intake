import { useFormStore } from '@/store/formStore';
import { TextareaField } from '@/components/wizard/TextareaField';
import { AlertOctagon, Clock, Package, ShoppingCart, UserX, DollarSign, Timer, Frown, Users } from 'lucide-react';

interface ChallengeItem {
  key: keyof import('@/types/form').BusinessChallenges;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}

const CHALLENGE_QUESTIONS: ChallengeItem[] = [
  {
    key: 'timeWaste',
    label: 'What wastes the most time in your daily operations?',
    placeholder: 'Think about tasks that consume hours but feel like they should take minutes — manual counting, re-entering data, chasing approvals, etc.',
    icon: <Clock size={16} style={{ color: 'var(--electric-dim)' }} />,
  },
  {
    key: 'inventoryChallenge',
    label: 'What is your biggest inventory challenge?',
    placeholder: 'Stock discrepancies? Inability to see real-time levels? Theft? Overstocking? Stockouts? Expired goods?',
    icon: <Package size={16} style={{ color: 'var(--electric-dim)' }} />,
  },
  {
    key: 'salesChallenge',
    label: 'What is your biggest sales challenge?',
    placeholder: 'Slow checkout? No visibility into daily performance? Cashier errors? Returns mismanagement? Unauthorized discounts?',
    icon: <ShoppingCart size={16} style={{ color: 'var(--electric-dim)' }} />,
  },
  {
    key: 'employeeMistakes',
    label: 'What are the most common employee mistakes?',
    placeholder: 'Pricing errors, incorrect change, stock miscounts, unauthorized transactions, data entry errors — describe the most frequent issues.',
    icon: <UserX size={16} style={{ color: 'var(--electric-dim)' }} />,
  },
  {
    key: 'recurringProblem',
    label: 'What is your most expensive recurring problem?',
    placeholder: 'Something that costs you money month after month — whether it is inventory loss, overtime labor, rework, or failed audits.',
    icon: <DollarSign size={16} style={{ color: 'var(--electric-dim)' }} />,
  },
  {
    key: 'moneyLoss',
    label: 'Where do you believe you are losing money?',
    placeholder: 'Unrecorded sales? Shrinkage? Supplier overcharging? Returns abuse? Outdated pricing? Be as specific as possible.',
    icon: <AlertOctagon size={16} style={{ color: 'var(--electric-dim)' }} />,
  },
  {
    key: 'timeLoss',
    label: 'Where do you lose the most time each day?',
    placeholder: 'Describe the biggest time drains — manual reports, end-of-day reconciliation, physical stock checks, resolving discrepancies.',
    icon: <Timer size={16} style={{ color: 'var(--electric-dim)' }} />,
  },
  {
    key: 'frustration',
    label: 'What frustrates you most about your current system?',
    placeholder: 'This could be anything — a report you cannot get, a process that never works, something you have tried to fix repeatedly without success.',
    icon: <Frown size={16} style={{ color: 'var(--electric-dim)' }} />,
  },
  {
    key: 'customerImpact',
    label: 'How do these problems affect your customers?',
    placeholder: 'Are customers experiencing delays at checkout? Receiving wrong items? Encountering stockouts? Facing inconsistent pricing?',
    icon: <Users size={16} style={{ color: 'var(--electric-dim)' }} />,
  },
];

export function Step06BusinessChallenges() {
  const { formData, updateField } = useFormStore();
  const d = formData.businessChallenges;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('businessChallenges', k, v);

  return (
    <div className="form-panel">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)' }}>
            <AlertOctagon size={20} style={{ color: '#ff6b6b' }} />
          </div>
          <span className="step-badge">Section 06</span>
        </div>
        <h2 className="section-title">Business Challenges</h2>
        <p className="section-subtitle">
          Understanding the friction points in your operation is what separates a generic system from a solution built for your reality.
          Be candid — every challenge you describe helps us engineer a more precise recommendation.
        </p>
        <div className="glow-line mt-6" />
      </div>

      <div className="space-y-7">
        {CHALLENGE_QUESTIONS.map((q) => (
          <div key={q.key} className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center rounded-xl mt-1"
              style={{
                width: 38, height: 38,
                background: 'rgba(127,169,255,0.06)',
                border: '1px solid rgba(127,169,255,0.15)',
              }}>
              {q.icon}
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
        ))}
      </div>
    </div>
  );
}
