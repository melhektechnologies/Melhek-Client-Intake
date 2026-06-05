import { ArrowRight, ArrowLeft, Send } from 'lucide-react';

interface WizardButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  isLast?: boolean;
  isSubmit?: boolean;
}

export function WizardButtons({
  onBack,
  onNext,
  nextLabel = 'Continue',
  isLast = false,
  isSubmit = false,
}: WizardButtonsProps) {
  const isFinalAction = isLast || isSubmit;

  return (
    <div
      className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-12 pt-8"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div>
        {onBack && (
          <button type="button" onClick={onBack} className="btn-secondary w-full sm:w-auto">
            <ArrowLeft size={16} />
            Back
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        className={`btn-primary w-full sm:w-auto px-10 py-4 text-base ${isFinalAction ? 'btn-submit' : ''}`}
      >
        {isFinalAction ? (
          <>
            <Send size={17} />
            {nextLabel}
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight size={17} />
          </>
        )}
      </button>
    </div>
  );
}
