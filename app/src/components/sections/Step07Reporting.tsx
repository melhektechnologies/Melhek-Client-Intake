import { useFormStore } from '@/store/formStore';
import { TextareaField } from '@/components/wizard/TextareaField';
import { BarChart3 } from 'lucide-react';

const REPORT_CATEGORIES = [
  {
    title: 'Sales Intelligence',
    reports: [
      { id: 'daily-sales', label: 'Daily Sales' },
      { id: 'weekly-sales', label: 'Weekly Sales Summary' },
      { id: 'monthly-sales', label: 'Monthly Sales Analytics' },
      { id: 'annual-sales', label: 'Annual Financial Overview' },
      { id: 'sales-category', label: 'Sales by Product Category' },
    ],
  },
  {
    title: 'Profitability & Performance',
    reports: [
      { id: 'gross-profit', label: 'Gross Profit Margins' },
      { id: 'net-profit', label: 'Net Profit Analytics' },
      { id: 'expenses', label: 'Operational Expenses' },
      { id: 'cashier-perf', label: 'Cashier/POS Performance' },
      { id: 'manager-perf', label: 'Managerial Performance' },
    ],
  },
  {
    title: 'Inventory & Stock Analytics',
    reports: [
      { id: 'top-selling', label: 'Top-Selling Products' },
      { id: 'slow-moving', label: 'Slow-Moving / Dead Stock' },
      { id: 'low-stock', label: 'Low Stock Alerts' },
      { id: 'inventory-value', label: 'Total Inventory Valuation' },
      { id: 'purchase-reports', label: 'Purchase & Restocking Reports' },
    ],
  },
  {
    title: 'Vendor & Customer Insights',
    reports: [
      { id: 'supplier-reports', label: 'Supplier Performance & Lead Times' },
      { id: 'customer-trends', label: 'Customer Purchase Trends' },
      { id: 'product-trends', label: 'Product Popularity Trends' },
      { id: 'custom-reports', label: 'Customizable Query Builder' },
    ],
  },
];

export function Step07Reporting() {
  const { formData, updateField } = useFormStore();
  const d = formData.reporting;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('reporting', k, v);

  const toggleReport = (id: string) => {
    const current = d.selectedReports;
    const updated = current.includes(id)
      ? current.filter(x => x !== id)
      : [...current, id];
    f('selectedReports', updated);
  };

  return (
    <div className="form-panel">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(127,169,255,0.1)', border: '1px solid rgba(127,169,255,0.2)' }}>
            <BarChart3 size={20} style={{ color: 'var(--electric)' }} />
          </div>
          <span className="step-badge">Section 07</span>
        </div>
        <h2 className="section-title">Reporting & Decision Making</h2>
        <p className="section-subtitle">
          Data is only valuable if it drives decision making. Tell us which metrics you need
          most and what critical questions you wish you could answer instantly.
        </p>
        <div className="glow-line mt-6" />
      </div>

      <div className="space-y-8">
        {/* Reports Selection Grid */}
        <div>
          <label className="input-label mb-4">
            Which reports would help you make better business decisions?
            <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>(Select all that apply)</span>
          </label>

          <div className="space-y-6">
            {REPORT_CATEGORIES.map((cat, idx) => (
              <div key={idx} style={{ background: 'rgba(7,15,60,0.3)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--electric)', marginBottom: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {cat.title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {cat.reports.map(rep => {
                    const active = d.selectedReports.includes(rep.id);
                    return (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => toggleReport(rep.id)}
                        className="text-left p-3 rounded-xl transition-all duration-200"
                        style={{
                          background: active ? 'rgba(127,169,255,0.1)' : 'rgba(7,15,60,0.3)',
                          border: `1px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div style={{
                            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                            background: active ? 'var(--electric)' : 'transparent',
                            border: `2px solid ${active ? 'var(--electric)' : 'rgba(127,169,255,0.3)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {active && <span style={{ width: 6, height: 6, borderRadius: 1, background: 'var(--dark)' }} />}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? 'var(--ice)' : 'var(--text-secondary)' }}>
                            {rep.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What information do you wish you had? */}
        <TextareaField
          label="What information do you wish you had every morning before opening the shop?"
          placeholder="E.g., 'I want a simple mobile dashboard showing total sales from yesterday, low-stock items across all 3 branches, and cashier discrepancy flags.'"
          value={d.morningInformation}
          onChange={v => f('morningInformation', v)}
          rows={4}
        />
      </div>
    </div>
  );
}
