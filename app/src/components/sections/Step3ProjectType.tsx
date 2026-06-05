import { useFormStore } from '@/store/formStore';
import { MultiSelectCard } from '@/components/wizard/MultiSelectCard';
import { TextareaField } from '@/components/wizard/TextareaField';
import {
  Globe, ShoppingCart, Hotel, UtensilsCrossed, Smartphone,
  BarChart3, Users2, Bot, Zap, CalendarCheck, Package, Code2, PlusCircle
} from 'lucide-react';

const PROJECT_TYPES = [
  { id: 'website', label: 'Website', icon: Globe, desc: 'Landing page, corporate, portfolio' },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart, desc: 'Online store, marketplace' },
  { id: 'hotel', label: 'Hotel System', icon: Hotel, desc: 'PMS, reservations, operations' },
  { id: 'restaurant', label: 'Restaurant System', icon: UtensilsCrossed, desc: 'POS, menus, orders' },
  { id: 'mobile-app', label: 'Mobile App', icon: Smartphone, desc: 'iOS, Android, cross-platform' },
  { id: 'erp', label: 'ERP', icon: BarChart3, desc: 'Enterprise resource planning' },
  { id: 'crm', label: 'CRM', icon: Users2, desc: 'Customer relationship management' },
  { id: 'ai-chatbot', label: 'AI Chatbot', icon: Bot, desc: 'Conversational AI agent' },
  { id: 'ai-automation', label: 'AI Automation', icon: Zap, desc: 'Workflow & process automation' },
  { id: 'booking', label: 'Booking System', icon: CalendarCheck, desc: 'Appointments, reservations' },
  { id: 'inventory', label: 'Inventory System', icon: Package, desc: 'Stock, warehouse, tracking' },
  { id: 'custom', label: 'Custom Software', icon: Code2, desc: 'Bespoke digital solution' },
  { id: 'other', label: 'Other', icon: PlusCircle, desc: 'Something unique — describe it' },
];

export function Step3ProjectType() {
  const { formData, updateField, errors } = useFormStore();
  const pt = formData.projectType;

  const toggle = (id: string) => {
    const next = pt.selected.includes(id)
      ? pt.selected.filter((s) => s !== id)
      : [...pt.selected, id];
    updateField('projectType', 'selected', next);
  };

  return (
    <div className="form-panel">
      <span className="step-badge">Step 03 / 10</span>
      <h2 className="section-title mt-4">Project Type</h2>
      <p className="section-subtitle">Select all digital solutions you require. You can choose multiple.</p>

      {errors['projectType.selected'] && (
        <div className="error-message mt-4">{errors['projectType.selected']}</div>
      )}

      {pt.selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {pt.selected.map((id) => {
            const t = PROJECT_TYPES.find((p) => p.id === id);
            return t ? (
              <span key={id} className="tag-pill">
                {t.label}
              </span>
            ) : null;
          })}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {PROJECT_TYPES.map((pt_item) => (
          <MultiSelectCard
            key={pt_item.id}
            icon={pt_item.icon}
            title={pt_item.label}
            description={pt_item.desc}
            selected={pt.selected.includes(pt_item.id)}
            onToggle={() => toggle(pt_item.id)}
          />
        ))}
      </div>

      {(pt.selected.includes('other') || pt.selected.includes('custom')) && (
        <div className="mt-6">
          <TextareaField
            label="Describe Your Custom Project"
            name="otherDescription"
            value={pt.otherDescription}
            onChange={(v) => updateField('projectType', 'otherDescription', v)}
            placeholder="Describe in as much detail as possible what you have in mind..."
            required minHeight={110}
            error={errors['projectType.otherDescription']}
          />
        </div>
      )}
    </div>
  );
}
