import { useFormStore } from '@/store/formStore';
import { FormInput } from '@/components/wizard/FormInput';
import { TextareaField } from '@/components/wizard/TextareaField';
import { Package, Tag, MapPin, Truck, Zap, Clock, AlertTriangle } from 'lucide-react';

const BARCODE_OPTIONS = [
  { value: 'yes-existing', label: 'Yes — barcodes already on products' },
  { value: 'yes-partial', label: 'Partially — some products have barcodes' },
  { value: 'no-but-willing', label: 'No — but willing to implement' },
  { value: 'no-not-needed', label: 'No — not needed for our workflow' },
];

const SUPPLIER_CODE_OPTIONS = [
  { value: 'yes', label: 'Yes — suppliers provide product codes' },
  { value: 'no', label: 'No — we assign our own codes' },
  { value: 'mixed', label: 'Mixed — varies by supplier' },
];

export function Step04Inventory() {
  const { formData, updateField } = useFormStore();
  const d = formData.inventory;
  const f = <K extends keyof typeof d>(k: K, v: typeof d[K]) => updateField('inventory', k, v);

  const renderRadio = (
    field: keyof typeof d,
    options: { value: string; label: string }[]
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map(opt => {
        const active = d[field] === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => f(field, active ? '' : opt.value)}
            className="text-left p-3.5 rounded-xl transition-all duration-200"
            style={{
              background: active ? 'rgba(127,169,255,0.12)' : 'rgba(7,15,60,0.4)',
              border: `1.5px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                background: active ? 'var(--electric)' : 'transparent',
                border: `2px solid ${active ? 'var(--electric)' : 'rgba(127,169,255,0.3)'}`,
                boxShadow: active ? '0 0 8px rgba(127,169,255,0.5)' : 'none',
              }} />
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? 'var(--ice)' : 'var(--text-secondary)' }}>
                {opt.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="form-panel">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center rounded-xl"
            style={{ width: 44, height: 44, background: 'rgba(127,169,255,0.1)', border: '1px solid rgba(127,169,255,0.2)' }}>
            <Package size={20} style={{ color: 'var(--electric)' }} />
          </div>
          <span className="step-badge">Section 04</span>
        </div>
        <h2 className="section-title">Inventory</h2>
        <p className="section-subtitle">
          Understanding your inventory structure is critical to designing the right product catalog,
          warehouse management, and stock tracking architecture.
        </p>
        <div className="glow-line mt-6" />
      </div>

      <div className="space-y-8">
        {/* Scale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Approximate Number of Products (SKUs)"
            placeholder="e.g. 500, ~2,000, 10,000+"
            value={d.approximateProducts}
            onChange={v => f('approximateProducts', v)}
            icon={<Tag size={15} style={{ color: 'var(--electric-dim)' }} />}
          />
          <FormInput
            label="Average Weekly Stock Arrivals"
            placeholder="e.g. 2 deliveries / week, 500 units/week"
            value={d.weeklyStockArrivals}
            onChange={v => f('weeklyStockArrivals', v)}
            icon={<Truck size={15} style={{ color: 'var(--electric-dim)' }} />}
          />
        </div>

        <TextareaField
          label="Product Categories"
          placeholder="List your main product categories — e.g. Beverages, Dairy, Grains, Electronics, Clothing, etc."
          value={d.categories}
          onChange={v => f('categories', v)}
          rows={2}
          icon={<Tag size={14} style={{ color: 'var(--electric-dim)' }} />}
        />

        <FormInput
          label="Units of Measurement Used"
          placeholder="e.g. Pieces, Kilograms, Liters, Cartons, Dozens, Meters"
          value={d.unitsOfMeasurement}
          onChange={v => f('unitsOfMeasurement', v)}
        />

        {/* Barcodes */}
        <div>
          <label className="input-label">Barcode Status</label>
          {renderRadio('barcodes', BARCODE_OPTIONS)}
        </div>

        {/* Supplier Codes */}
        <div>
          <label className="input-label">Supplier Product Codes</label>
          {renderRadio('supplierCodes', SUPPLIER_CODE_OPTIONS)}
        </div>

        {/* Warehouse */}
        <div>
          <label className="input-label">
            Warehouse / Storage Locations
            <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>(optional)</span>
          </label>
          <FormInput
            label=""
            placeholder="e.g. Main warehouse, 2 branch stockrooms, cold storage room"
            value={d.warehouseLocations}
            onChange={v => f('warehouseLocations', v)}
            icon={<MapPin size={15} style={{ color: 'var(--electric-dim)' }} />}
          />
        </div>

        {/* Multiple Branches */}
        <div>
          <label className="input-label">Does stock move between branches?</label>
          <div className="grid grid-cols-3 gap-3">
            {['Yes — frequently', 'Occasionally', 'No — each branch is independent'].map(opt => {
              const active = d.multipleBranches === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => f('multipleBranches', active ? '' : opt)}
                  className="p-3.5 rounded-xl transition-all duration-200 text-left"
                  style={{
                    background: active ? 'rgba(127,169,255,0.12)' : 'rgba(7,15,60,0.4)',
                    border: `1.5px solid ${active ? 'var(--electric-dim)' : 'var(--border)'}`,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? 'var(--ice)' : 'var(--text-secondary)' }}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Movement Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextareaField
            label="Fast-Moving Products"
            placeholder="Which products sell the fastest? List categories or specific items."
            value={d.fastMovingProducts}
            onChange={v => f('fastMovingProducts', v)}
            rows={3}
            icon={<Zap size={14} style={{ color: 'var(--electric-dim)' }} />}
          />
          <TextareaField
            label="Slow-Moving Products"
            placeholder="Which products tend to sit on shelves the longest?"
            value={d.slowMovingProducts}
            onChange={v => f('slowMovingProducts', v)}
            rows={3}
            icon={<Clock size={14} style={{ color: 'var(--electric-dim)' }} />}
          />
        </div>

        <TextareaField
          label="Products That Are Difficult to Track"
          placeholder="Are there product types that are particularly hard to manage — loose items, bulk goods, high-theft items, short-expiry products?"
          value={d.difficultToTrack}
          onChange={v => f('difficultToTrack', v)}
          rows={3}
          icon={<AlertTriangle size={14} style={{ color: 'var(--electric-dim)' }} />}
        />
      </div>
    </div>
  );
}
