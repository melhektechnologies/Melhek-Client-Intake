import { useFormStore } from '@/store/formStore';
import { Check } from 'lucide-react';
import { TextareaField } from '@/components/wizard/TextareaField';

const CONTENT_ITEMS = [
  { key: 'logo' as const, label: 'Company Logo', desc: 'Vector, PNG, or original design files' },
  { key: 'images' as const, label: 'Product / Service Images', desc: 'Photos, renders, lifestyle shots' },
  { key: 'videos' as const, label: 'Videos', desc: 'Brand videos, testimonials, demos' },
  { key: 'productInfo' as const, label: 'Product Information', desc: 'Specs, descriptions, pricing' },
  { key: 'serviceInfo' as const, label: 'Service Descriptions', desc: 'Service pages, feature lists' },
  { key: 'companyProfile' as const, label: 'Company Profile', desc: 'About us, team, history' },
  { key: 'testimonials' as const, label: 'Testimonials / Reviews', desc: 'Client quotes, case studies' },
  { key: 'legalContent' as const, label: 'Legal Content', desc: 'Privacy policy, terms, compliance' },
];

export function Step7ContentAvailability() {
  const { formData, updateField, updateSection } = useFormStore();
  const ca = formData.contentAvailability;

  const typeKey = (key: keyof Omit<typeof ca, 'additionalNotes'>) => 
    key as keyof Omit<typeof ca, 'additionalNotes'>;

  const toggleCheck = (key: keyof Omit<typeof ca, 'additionalNotes'>) => {
    const item = ca[key];
    updateSection('contentAvailability', {
      [key]: { ...item, checked: !item.checked, needsHelp: false },
    });
  };

  const toggleNeedsHelp = (key: keyof Omit<typeof ca, 'additionalNotes'>) => {
    const item = ca[key];
    updateSection('contentAvailability', {
      [key]: { ...item, needsHelp: !item.needsHelp },
    });
  };

  return (
    <div className="form-panel">
      <span className="step-badge">Step 07 / 10</span>
      <h2 className="section-title mt-4">Content Availability</h2>
      <p className="section-subtitle">
        Let us know what content you already have and what you'll need help creating.
      </p>

      {/* Column Headers */}
      <div className="mt-8 grid grid-cols-12 gap-3 px-4 pb-2"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="col-span-7">
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 500 }}>
            CONTENT TYPE
          </span>
        </div>
        <div className="col-span-3 text-center">
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 500 }}>
            HAVE IT
          </span>
        </div>
        <div className="col-span-2 text-center">
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 500 }}>
            NEED HELP
          </span>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        {CONTENT_ITEMS.map(({ key, label, desc }) => {
          const item = ca[typeKey(key)];
          return (
            <div
              key={key}
              className="grid grid-cols-12 gap-3 items-center p-4 rounded-xl transition-all duration-200"
              style={{
                background: item.checked ? 'rgba(127,169,255,0.05)' : 'rgba(7,15,60,0.3)',
                border: `1px solid ${item.checked ? 'rgba(127,169,255,0.2)' : 'var(--border)'}`,
              }}
            >
              {/* Label */}
              <div className="col-span-7">
                <p style={{ fontSize: 14, fontWeight: 600, color: item.checked ? 'var(--ice)' : 'var(--text-secondary)' }}>
                  {label}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</p>
              </div>

              {/* Have it toggle */}
              <div className="col-span-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => toggleCheck(typeKey(key))}
                  className="flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{
                    width: 32, height: 32,
                    background: item.checked ? 'var(--electric)' : 'transparent',
                    border: `2px solid ${item.checked ? 'var(--electric)' : 'rgba(127,169,255,0.25)'}`,
                    boxShadow: item.checked ? '0 0 10px rgba(127,169,255,0.4)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {item.checked && <Check size={15} color="var(--dark)" strokeWidth={3} />}
                </button>
              </div>

              {/* Need help toggle */}
              <div className="col-span-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => item.checked && toggleNeedsHelp(typeKey(key))}
                  title={item.checked ? 'Toggle assistance needed' : 'Check "Have it" first'}
                  className="flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{
                    width: 32, height: 32,
                    background: item.needsHelp ? 'rgba(255,209,102,0.15)' : 'transparent',
                    border: `2px solid ${item.needsHelp ? 'rgba(255,209,102,0.5)' : 'rgba(127,169,255,0.15)'}`,
                    opacity: item.checked ? 1 : 0.3,
                    cursor: item.checked ? 'pointer' : 'default',
                  }}
                >
                  {item.needsHelp && <Check size={15} color="var(--warning)" strokeWidth={3} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 mt-6 pt-4"
        style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--electric)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Content ready</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 14, height: 14, borderRadius: 4, background: 'rgba(255,209,102,0.3)', border: '1px solid rgba(255,209,102,0.5)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Needs Melhek's help</span>
        </div>
      </div>

      <div className="mt-6">
        <TextareaField
          label="Content Strategy Notes"
          name="additionalNotes"
          value={ca.additionalNotes}
          onChange={(v) => updateField('contentAvailability', 'additionalNotes', v)}
          placeholder="Any additional context about your content situation, existing content management systems, or specific requirements..."
          optional minHeight={100}
        />
      </div>
    </div>
  );
}
