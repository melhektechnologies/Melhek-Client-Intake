import { useState } from 'react';
import { useFormStore } from '@/store/formStore';
import { MultiSelectCard } from '@/components/wizard/MultiSelectCard';
import { FileUploadZone } from '@/components/wizard/FileUploadZone';
import { FormInput } from '@/components/wizard/FormInput';
import { Plus, X } from 'lucide-react';
import {
  Minimize2, Building2, Palette, Diamond, Cpu, Smile, BookOpen, Sparkles
} from 'lucide-react';

const DESIGN_STYLES = [
  { id: 'modern-minimalist', label: 'Modern Minimalist', icon: Minimize2, desc: 'Clean, lots of whitespace' },
  { id: 'corporate', label: 'Corporate Pro', icon: Building2, desc: 'Trusted, structured, bold' },
  { id: 'creative', label: 'Creative Bold', icon: Palette, desc: 'Expressive, colorful, unique' },
  { id: 'luxury', label: 'Elegant Luxury', icon: Diamond, desc: 'Premium, refined, exclusive' },
  { id: 'tech', label: 'Tech Futuristic', icon: Cpu, desc: 'Dark, modern, high-tech' },
  { id: 'warm', label: 'Warm Friendly', icon: Smile, desc: 'Approachable, human, soft' },
  { id: 'editorial', label: 'Clean Editorial', icon: BookOpen, desc: 'Content-first, magazine-style' },
  { id: 'playful', label: 'Playful', icon: Sparkles, desc: 'Fun, vibrant, energetic' },
];

export function Step6DesignPreferences() {
  const { formData, updateField, updateSection, errors } = useFormStore();
  const dp = formData.designPreferences;

  const toggleStyle = (id: string) => {
    const next = dp.style.includes(id)
      ? dp.style.filter((s) => s !== id)
      : [...dp.style, id];
    updateField('designPreferences', 'style', next);
  };

  const addColor = () => {
    if (dp.colors.length >= 6) return;
    updateField('designPreferences', 'colors', [...dp.colors, '#7fa9ff']);
  };

  const removeColor = (idx: number) => {
    updateField('designPreferences', 'colors', dp.colors.filter((_, i) => i !== idx));
  };

  const updateColor = (idx: number, val: string) => {
    const next = [...dp.colors];
    next[idx] = val;
    updateField('designPreferences', 'colors', next);
  };

  return (
    <div className="form-panel">
      <span className="step-badge">Step 06 / 10</span>
      <h2 className="section-title mt-4">Design Preferences</h2>
      <p className="section-subtitle">Share your visual direction so we can build something that feels right.</p>

      <div className="mt-8 space-y-8">
        {/* Logo Upload */}
        <FileUploadZone
          label="Existing Logo Files"
          files={dp.logoFiles}
          onChange={(files) => updateField('designPreferences', 'logoFiles', files)}
          accept="image/*,.svg,.pdf,.ai,.eps"
          multiple
          hint="SVG, PNG, PDF, AI — all formats accepted"
        />

        {/* Brand Guidelines */}
        <FileUploadZone
          label="Brand Guidelines / Style Guide"
          files={dp.brandGuidelines}
          onChange={(files) => updateField('designPreferences', 'brandGuidelines', files)}
          accept=".pdf,.doc,.docx,.pptx,image/*"
          multiple
          hint="PDF, PPTX, Word documents — anything that shows your standards"
        />

        {/* Color Palette */}
        <div>
          <label className="input-label">Preferred Brand Colors</label>
          <div className="space-y-3">
            {dp.colors.map((color, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(7,15,60,0.4)', border: '1px solid var(--border)' }}
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(idx, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  style={{ flexShrink: 0 }}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => updateColor(idx, e.target.value)}
                  className="input-field flex-1"
                  style={{ minHeight: 40, fontFamily: 'var(--font-mono)', fontSize: 13 }}
                  placeholder="#7fa9ff"
                />
                {dp.colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColor(idx)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            {dp.colors.length < 6 && (
              <button
                type="button"
                onClick={addColor}
                className="flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--electric-dim)', padding: '8px 4px',
                }}
              >
                <Plus size={16} />
                Add Color
              </button>
            )}
          </div>
        </div>

        {/* Design Styles */}
        <div>
          <label className="input-label">
            Design Style Preferences
            {errors['designPreferences.style'] && (
              <span className="ml-2 text-xs font-normal" style={{ color: 'var(--error)' }}>
                {errors['designPreferences.style']}
              </span>
            )}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {DESIGN_STYLES.map((s) => (
              <MultiSelectCard
                key={s.id}
                icon={s.icon}
                title={s.label}
                description={s.desc}
                selected={dp.style.includes(s.id)}
                onToggle={() => toggleStyle(s.id)}
                compact
              />
            ))}
          </div>
        </div>

        {/* Example Websites */}
        <FormInput
          label="Example Websites You Love"
          name="exampleWebsites"
          value={dp.exampleWebsites}
          onChange={(v) => updateField('designPreferences', 'exampleWebsites', v)}
          placeholder="https://stripe.com, https://linear.app, https://vercel.com..."
          optional
          hint="References help us understand your visual taste. Include URLs, descriptions, or what you like about them."
        />
      </div>
    </div>
  );
}
