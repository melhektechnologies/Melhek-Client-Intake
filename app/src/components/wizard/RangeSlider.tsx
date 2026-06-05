const BUDGET_OPTIONS = ['Under 100k ETB', '100k–500k ETB', '500k–1.5M ETB', '1.5M–5M ETB', '5M+ ETB'];

interface RangeSliderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export function RangeSlider({ label, value, onChange, required = false, error }: RangeSliderProps) {
  const index = BUDGET_OPTIONS.indexOf(value);
  const pct = index >= 0 ? (index / (BUDGET_OPTIONS.length - 1)) * 100 : 0;

  return (
    <div className="w-full">
      <label className="input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>

      <div
        className="p-6 rounded-xl"
        style={{ background: 'rgba(7,15,60,0.4)', border: '1px solid var(--border)' }}
      >
        {/* Value Display */}
        <div className="text-center mb-8">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--electric-dim), var(--electric-bright))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {value || '—'}
          </span>
          {value && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              INVESTMENT RANGE (BIRR)
            </p>
          )}
        </div>

        {/* Slider Track */}
        <div className="relative mb-6 px-1">
          <div
            className="absolute top-1/2 -translate-y-1/2 left-1 right-1 rounded-full"
            style={{ height: 4, background: 'var(--border)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, var(--electric-dim), var(--electric))',
                boxShadow: '0 0 8px rgba(127,169,255,0.5)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={BUDGET_OPTIONS.length - 1}
            step={1}
            value={index >= 0 ? index : 0}
            onChange={(e) => onChange(BUDGET_OPTIONS[parseInt(e.target.value)])}
            className="w-full relative z-10"
            style={{ height: 32, background: 'transparent' }}
          />
        </div>

        {/* Tick Labels */}
        <div className="flex justify-between">
          {BUDGET_OPTIONS.map((opt) => {
            const active = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
              >
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: active ? 'var(--electric)' : 'rgba(127,169,255,0.2)',
                  boxShadow: active ? '0 0 6px rgba(127,169,255,0.6)' : 'none',
                  transition: 'all 0.2s',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  fontWeight: active ? 700 : 400,
                  color: active ? 'var(--electric)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="error-message mt-2">{error}</div>
      )}
    </div>
  );
}
