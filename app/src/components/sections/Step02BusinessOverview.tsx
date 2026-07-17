import { useFormStore } from '@/store/formStore';
import { FormInput } from '@/components/wizard/FormInput';
import { TextareaField } from '@/components/wizard/TextareaField';
import { SelectDropdown } from '@/components/wizard/SelectDropdown';
import { BarChart3, Users, ShoppingCart, TrendingUp } from 'lucide-react';

const SALES_RANGES = [
  { value: 'under-50k', label: 'Under ETB 50,000' },
  { value: '50k-200k', label: 'ETB 50,000 – 200,000' },
  { value: '200k-500k', label: 'ETB 200,000 – 500,000' },
  { value: '500k-1m', label: 'ETB 500,000 – 1,000,000' },
  { value: '1m-5m', label: 'ETB 1,000,000 – 5,000,000' },
  { value: 'above-5m', label: 'Above ETB 5,000,000' },
  { value: 'prefer-not', label: 'Prefer not to disclose' },
];

interface StatInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

function StatInput({ label, value, onChange, placeholder = '0', icon }: StatInputProps) {
  return (
    <div style={{ background: 'rgba(7,15,60,0.5)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <input
        type="number"
        min="0"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
        style={{ padding: '8px 0', background: 'transparent', border: 'none', fontSize: 22, fontWeight: 700, color: 'var(--electric)', minHeight: 'auto' }}
      />
    </div>
  );
}

export function Step02BusinessOverview() {
  const { formData, updateField, errors } = useFormStore();
  const d = formData.businessOverview;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('businessOverview', k, v);

  return (
    <div className="form-panel">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(127,169,255,0.1)', border: '1px solid rgba(127,169,255,0.2)' }}>
            <BarChart3 size={20} style={{ color: 'var(--electric)' }} />
          </div>
          <span className="step-badge">Section 02</span>
        </div>
        <h2 className="section-title">Business Overview</h2>
        <p className="section-subtitle">
          Help us understand the scale and structure of your operations.
          This baseline data directly informs the scope and architecture of our recommended solution.
        </p>
        <div className="glow-line mt-6" />
      </div>

      <div className="space-y-8">
        {/* Operating Stats */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: 'var(--electric-dim)' }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Operating Statistics</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatInput
              label="Years in Operation"
              value={d.yearsInOperation}
              onChange={v => f('yearsInOperation', v)}
              placeholder="e.g. 5"
              icon={<TrendingUp size={13} style={{ color: 'var(--electric-dim)' }} />}
            />
            <StatInput
              label="Daily Customers"
              value={d.dailyCustomers}
              onChange={v => f('dailyCustomers', v)}
              placeholder="e.g. 120"
              icon={<ShoppingCart size={13} style={{ color: 'var(--electric-dim)' }} />}
            />
          </div>
          {errors['businessOverview.yearsInOperation'] && (
            <p className="error-message mt-2">⚠ {errors['businessOverview.yearsInOperation']}</p>
          )}
        </div>

        {/* Staff Breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users size={14} style={{ color: 'var(--electric-dim)' }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Staff Breakdown</p>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>(enter 0 if not applicable)</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatInput label="Total Employees" value={d.totalEmployees} onChange={v => f('totalEmployees', v)} />
            <StatInput label="Cashiers" value={d.cashiers} onChange={v => f('cashiers', v)} />
            <StatInput label="Managers" value={d.managers} onChange={v => f('managers', v)} />
            <StatInput label="Storekeepers" value={d.storekeepers} onChange={v => f('storekeepers', v)} />
          </div>
        </div>

        {/* Monthly Sales Range */}
        <div>
          <label className="input-label">
            Estimated Monthly Sales Range
            <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>(optional — helps size the solution)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SALES_RANGES.map(r => {
              const active = d.monthlySalesRange === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => f('monthlySalesRange', active ? '' : r.value)}
                  className="text-left p-3.5 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? 'rgba(127,169,255,0.12)' : 'rgba(7,15,60,0.4)',
                    border: `1.5px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
                    boxShadow: active ? '0 0 14px rgba(127,169,255,0.1)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? 'var(--ice)' : 'var(--text-secondary)' }}>
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products & Services */}
        <TextareaField
          label="Main Products / Services"
          info="This helps us determine which inventory modules and item categorizations to recommend."
          required
          placeholder="Describe what your business sells or provides. Be specific — e.g. 'We sell electronics, mobile phones, accessories, and spare parts across 3 branches.'"
          value={d.productsServices}
          onChange={v => f('productsServices', v)}
          rows={4}
          error={errors['businessOverview.productsServices']}
        />

        {/* Business Goals */}
        <TextareaField
          label="Business Goals for the Next 2 Years"
          info="Knowing where you are heading allows us to architect scalable systems that grow with you."
          required
          placeholder="What does growth look like for your business? New branches? More products? Better margins? Describe your strategic direction."
          value={d.businessGoals}
          onChange={v => f('businessGoals', v)}
          rows={4}
          error={errors['businessOverview.businessGoals']}
        />
      </div>
    </div>
  );
}
