import { useFormStore } from '@/store/formStore';
import { SelectDropdown } from '@/components/wizard/SelectDropdown';
import { Lock } from 'lucide-react';

const SYSTEM_ROLES = [
  { value: 'owner', label: '👑 Owner / Director' },
  { value: 'manager', label: '👔 Store Manager' },
  { value: 'cashier', label: '💳 Cashier / Front-desk' },
  { value: 'storekeeper', label: '📦 Storekeeper / Warehouse Staff' },
  { value: 'accountant', label: '📊 Accountant / Finance Officer' },
  { value: 'administrator', label: '⚙️ System Administrator' },
];

const PERMISSION_OPTIONS = [
  { value: 'yes-same', label: 'Yes — everyone should have identical system access.' },
  { value: 'no-restricted', label: 'No — roles must be isolated (e.g. cashiers cannot view profit reports).' },
  { value: 'undecided', label: 'Undecided — we need consulting assistance to define permissions.' },
];

const APPROVER_ROLES = [
  { value: 'Owner Only', label: 'Owner Only' },
  { value: 'Manager & Owner', label: 'Manager & Owner' },
  { value: 'Any Manager', label: 'Any Manager' },
  { value: 'Accountant', label: 'Accountant' },
  { value: 'System Admin', label: 'System Admin' },
  { value: 'No approval needed', label: 'No approval needed' },
];

export function Step08SecurityRoles() {
  const { formData, updateField } = useFormStore();
  const d = formData.securityRoles;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('securityRoles', k, v);

  const toggleRole = (val: string) => {
    const current = d.userRoles;
    const updated = current.includes(val) ? current.filter(x => x !== val) : [...current, val];
    f('userRoles', updated);
  };

  return (
    <div className="form-panel">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(127,169,255,0.1)', border: '1px solid rgba(127,169,255,0.2)' }}>
            <Lock size={20} style={{ color: 'var(--electric)' }} />
          </div>
          <span className="step-badge">Section 08</span>
        </div>
        <h2 className="section-title">Security & User Roles</h2>
        <p className="section-subtitle">
          Define access control layers, accountability controls, and security parameters.
          This ensures proper audits, prevents fraud, and keeps system operation clean.
        </p>
        <div className="glow-line mt-6" />
      </div>

      <div className="space-y-8">
        {/* System Users */}
        <div>
          <label className="input-label mb-3">Who will be using this system? (Select all that apply)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SYSTEM_ROLES.map(role => {
              const active = d.userRoles.includes(role.value);
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => toggleRole(role.value)}
                  className="text-left p-4 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? 'rgba(127,169,255,0.12)' : 'rgba(7,15,60,0.4)',
                    border: `1.5px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? 'var(--ice)' : 'var(--text-secondary)' }}>
                    {role.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Same Permissions */}
        <div>
          <label className="input-label mb-3">Should everyone have the same permissions?</label>
          <div className="space-y-2.5">
            {PERMISSION_OPTIONS.map(opt => {
              const active = d.samePermissions === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => f('samePermissions', opt.value)}
                  className="w-full text-left p-4 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? 'rgba(127,169,255,0.1)' : 'rgba(7,15,60,0.3)',
                    border: `1px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 2,
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
        </div>

        {/* Approval Authorities */}
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ice)', marginBottom: 16, borderLeft: '3px solid var(--electric)', paddingLeft: 10 }}>
            System Approvals & Safeguards
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SelectDropdown
              label="Who should approve stock adjustments?"
              options={APPROVER_ROLES}
              value={d.stockAdjustmentApprover}
              onChange={v => f('stockAdjustmentApprover', v)}
              placeholder="Select role"
            />
            <SelectDropdown
              label="Who should approve price changes?"
              options={APPROVER_ROLES}
              value={d.priceChangeApprover}
              onChange={v => f('priceChangeApprover', v)}
              placeholder="Select role"
            />
            <SelectDropdown
              label="Who should approve deleting records?"
              options={APPROVER_ROLES}
              value={d.deleteRecordsApprover}
              onChange={v => f('deleteRecordsApprover', v)}
              placeholder="Select role"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
