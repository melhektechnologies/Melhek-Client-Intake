import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ProgressNav } from '@/components/wizard/ProgressNav';
import { WizardButtons } from '@/components/wizard/WizardButtons';
import { useFormStore } from '@/store/formStore';
import { Step01BusinessInfo } from '@/components/sections/Step01BusinessInfo';
import { Step02BusinessOverview } from '@/components/sections/Step02BusinessOverview';
import { Step03CurrentWorkflow } from '@/components/sections/Step03CurrentWorkflow';
import { Step04Inventory } from '@/components/sections/Step04Inventory';
import { Step05CurrentSoftware } from '@/components/sections/Step05CurrentSoftware';
import { Step06BusinessChallenges } from '@/components/sections/Step06BusinessChallenges';
import { Step07Reporting } from '@/components/sections/Step07Reporting';
import { Step08SecurityRoles } from '@/components/sections/Step08SecurityRoles';
import { Step09ProjectGoals } from '@/components/sections/Step09ProjectGoals';
import { Step10ProjectQualification } from '@/components/sections/Step10ProjectQualification';
import { Step11AdditionalNotes } from '@/components/sections/Step11AdditionalNotes';

const STEPS = [
  Step01BusinessInfo, Step02BusinessOverview, Step03CurrentWorkflow, Step04Inventory,
  Step05CurrentSoftware, Step06BusinessChallenges, Step07Reporting, Step08SecurityRoles,
  Step09ProjectGoals, Step10ProjectQualification, Step11AdditionalNotes,
];

export function WizardPage() {
  const { stepNumber } = useParams();
  const navigate = useNavigate();
  const [direction, setDirection] = useState(1);
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
      { 
        opacity: 0, 
        x: direction > 0 ? 30 : -30,
        scale: 0.985,
        filter: 'blur(4px)'
      },
      { 
        opacity: 1, 
        x: 0, 
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.5, 
        ease: 'power3.out' 
      }
    );
    }
  }, [step, direction]);

  const exit = (dir: 'forward' | 'back', cb: () => void) => {
    setDirection(dir === 'forward' ? 1 : -1);
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
        step < 11 ? navigate(`/step/${step + 1}`) : navigate('/review');
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

      <ProgressNav currentStep={step} totalSteps={11} />

      <main className="relative z-10 py-8 md:py-14 px-4">
        <div ref={contentRef}>
          <StepComponent />
          <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto' }}>
            <WizardButtons
              onBack={handleBack}
              onNext={handleNext}
              nextLabel={step === 11 ? 'Review & Submit' : 'Continue'}
              isLast={step === 11}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
