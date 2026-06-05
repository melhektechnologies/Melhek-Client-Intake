import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ProgressNav } from '@/components/wizard/ProgressNav';
import { WizardButtons } from '@/components/wizard/WizardButtons';
import { useFormStore } from '@/store/formStore';
import { Step1CompanyInfo } from '@/components/sections/Step1CompanyInfo';
import { Step2BusinessOverview } from '@/components/sections/Step2BusinessOverview';
import { Step3ProjectType } from '@/components/sections/Step3ProjectType';
import { Step4ProjectGoals } from '@/components/sections/Step4ProjectGoals';
import { Step5RequiredFeatures } from '@/components/sections/Step5RequiredFeatures';
import { Step6DesignPreferences } from '@/components/sections/Step6DesignPreferences';
import { Step7ContentAvailability } from '@/components/sections/Step7ContentAvailability';
import { Step8TechnicalRequirements } from '@/components/sections/Step8TechnicalRequirements';
import { Step9TimelineBudget } from '@/components/sections/Step9TimelineBudget';
import { Step10StrategicIntelligence } from '@/components/sections/Step10StrategicIntelligence';

const STEPS = [
  Step1CompanyInfo, Step2BusinessOverview, Step3ProjectType, Step4ProjectGoals,
  Step5RequiredFeatures, Step6DesignPreferences, Step7ContentAvailability,
  Step8TechnicalRequirements, Step9TimelineBudget, Step10StrategicIntelligence,
];

export function WizardPage() {
  const { stepNumber } = useParams();
  const navigate = useNavigate();
  const { validateStep, clearErrors } = useFormStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const step = parseInt(stepNumber || '1', 10);
  const StepComponent = STEPS[step - 1];

  useEffect(() => {
    if (!StepComponent) navigate('/');
  }, [StepComponent, navigate]);

  // Slide-in on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 32 },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [step]);

  const exit = (dir: 'forward' | 'back', cb: () => void) => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0, x: dir === 'forward' ? -32 : 32,
        duration: 0.25, ease: 'power2.in', onComplete: cb,
      });
    } else cb();
  };

  const handleNext = () => {
    clearErrors();
    if (validateStep(step)) {
      exit('forward', () => {
        step < 10 ? navigate(`/step/${step + 1}`) : navigate('/review');
      });
    } else {
      // Shake the panel
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          x: [-6, 6, -5, 5, -3, 3, 0] as any,
          duration: 0.45, ease: 'none', clearProps: 'x',
        });
      }
      setTimeout(() => {
        const firstErr = document.querySelector('.error-message');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 60);
    }
  };

  const handleBack = () => {
    clearErrors();
    exit('back', () => {
      step > 1 ? navigate(`/step/${step - 1}`) : navigate('/');
    });
  };

  if (!StepComponent) return null;

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--dark)' }}>
      {/* Subtle background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #7fa9ff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          zIndex: 0,
        }}
      />

      <ProgressNav currentStep={step} />

      <main className="relative z-10 py-8 md:py-14 px-4">
        <div ref={contentRef}>
          <StepComponent />
          <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto' }}>
            <WizardButtons
              onBack={handleBack}
              onNext={handleNext}
              nextLabel={step === 10 ? 'Review & Submit' : 'Continue'}
              isLast={step === 10}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
