import { useFormStore } from '@/store/formStore';
import { Monitor, FileSpreadsheet, Cloud, Database, Cpu } from 'lucide-react';

const EXPORT_CAPABILITIES = [
  { value: 'csv', label: 'CSV Export', icon: '📄' },
  { value: 'excel', label: 'Excel Export', icon: '📊' },
  { value: 'api', label: 'API / Integration', icon: '🔗' },
  { value: 'database', label: 'Direct DB Access', icon: '🗄️' },
  { value: 'pos-integrate', label: 'POS Can Integrate', icon: '🔌' },
  { value: 'unknown', label: 'Not Sure', icon: '❓' },
  { value: 'none', label: 'None Available', icon: '🚫' },
];

const CLOUD_OPTIONS = [
  'Google Drive', 'Dropbox', 'OneDrive', 'Local Server', 'USB / External Drive', 'No Cloud Storage',
];

export function Step05CurrentSoftware() {
  const { formData, updateField } = useFormStore();
  const d = formData.currentSoftware;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('currentSoftware', k, v);

  const toggleExport = (val: string) => {
    const current = d.exportCapabilities;
    const updated = current.includes(val) ? current.filter(x => x !== val) : [...current, val];
    f('exportCapabilities', updated);
  };

  const SoftwareBlock = ({
    label, placeholder, value, onChange, icon, note,
  }: {
    label: string; placeholder: string; value: string;
    onChange: (v: string) => void; icon: React.ReactNode; note?: string;
  }) => (
    <div style={{
      background: 'rgba(7,15,60,0.45)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '18px 20px',
    }}>
      <div className="flex items-center gap-2.5 mb-3">
        {icon}
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>{label}</span>
        {note && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{note}</span>}
      </div>
      <input
        type="text"
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );

  return (
    <div className="form-panel">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(127,169,255,0.1)', border: '1px solid rgba(127,169,255,0.2)' }}>
            <Monitor size={20} style={{ color: 'var(--electric)' }} />
          </div>
          <span className="step-badge">Section 05</span>
        </div>
        <h2 className="section-title">Current Software & Systems</h2>
        <p className="section-subtitle">
          Understanding your existing technology stack helps us identify integration opportunities,
          data migration requirements, and potential compatibility constraints.
        </p>
        <div className="glow-line mt-6" />
      </div>

      <div className="space-y-6">
        {/* Software Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SoftwareBlock
            label="POS System"
            placeholder="e.g. iCG, Custom POS, None"
            value={d.posSystem}
            onChange={v => f('posSystem', v)}
            icon={<Cpu size={15} style={{ color: 'var(--electric-dim)' }} />}
          />
          <SoftwareBlock
            label="Inventory Software"
            placeholder="e.g. Excel, Odoo, Custom, None"
            value={d.inventorySoftware}
            onChange={v => f('inventorySoftware', v)}
            icon={<Database size={15} style={{ color: 'var(--electric-dim)' }} />}
          />
          <SoftwareBlock
            label="Accounting Software"
            placeholder="e.g. Peachtree, QuickBooks, Manual, None"
            value={d.accountingSoftware}
            onChange={v => f('accountingSoftware', v)}
            icon={<FileSpreadsheet size={15} style={{ color: 'var(--electric-dim)' }} />}
          />
          <div style={{ background: 'rgba(7,15,60,0.45)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <Cloud size={15} style={{ color: 'var(--electric-dim)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Cloud / File Storage</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CLOUD_OPTIONS.map(opt => {
                const active = d.cloudStorage === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => f('cloudStorage', active ? '' : opt)}
                    className="transition-all duration-200"
                    style={{
                      padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: active ? 'rgba(127,169,255,0.18)' : 'rgba(127,169,255,0.05)',
                      border: `1px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
                      color: active ? 'var(--electric)' : 'var(--text-secondary)',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Manual Systems */}
        <div>
          <label className="input-label">Manual Record Keeping</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'usesExcel' as const, label: '📊 Uses Microsoft Excel', desc: 'Spreadsheets for records, reports, or stock' },
              { key: 'paperRecords' as const, label: '📋 Uses Paper Records', desc: 'Notebooks, ledgers, or printed forms' },
            ].map(({ key, label, desc }) => {
              const active = d[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => f(key, !active)}
                  className="text-left p-4 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? 'rgba(127,169,255,0.12)' : 'rgba(7,15,60,0.4)',
                    border: `1.5px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 600, color: active ? 'var(--ice)' : 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Export Capabilities */}
        <div>
          <label className="input-label">
            Data Export & Integration Capabilities
            <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>Select all that apply</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {EXPORT_CAPABILITIES.map(cap => {
              const active = d.exportCapabilities.includes(cap.value);
              return (
                <button
                  key={cap.value}
                  type="button"
                  onClick={() => toggleExport(cap.value)}
                  className="p-3.5 rounded-xl transition-all duration-200 text-left"
                  style={{
                    background: active ? 'rgba(127,169,255,0.12)' : 'rgba(7,15,60,0.4)',
                    border: `1.5px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
                    boxShadow: active ? '0 0 14px rgba(127,169,255,0.1)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>{cap.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: active ? 600 : 500, color: active ? 'var(--electric)' : 'var(--text-secondary)' }}>
                    {cap.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
