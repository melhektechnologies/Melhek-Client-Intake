import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { FormData, FormSection } from '@/types/form';
import { defaultFormData } from '@/types/form';

interface ValidationErrors {
  [key: string]: string;
}

interface FormStore {
  formData: FormData;
  errors: ValidationErrors;
  updateField: <T extends FormSection>(section: T, field: keyof FormData[T], value: unknown) => void;
  updateSection: <T extends FormSection>(section: T, data: Partial<FormData[T]>) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearErrors: () => void;
  validateStep: (step: number) => boolean;
  getStepErrors: (step: number) => ValidationErrors;
  saveDraft: () => void;
  loadDraft: () => boolean;
  hasDraft: () => boolean;
  lastSaved: Date | null;
  isDirty: boolean;
  submissionId: string | null;
  setSubmissionId: (id: string) => void;
}

const FormContext = createContext<FormStore | null>(null);

const DRAFT_KEY = 'melhek-discovery-draft';

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          return { ...defaultFormData, ...JSON.parse(saved) };
        } catch { /* ignore */ }
      }
    }
    return defaultFormData;
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Refs for debounced auto-save — holds latest formData without stale closure
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formDataRef = useRef<FormData>(formData);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  const persistDraft = useCallback((data: FormData) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      setLastSaved(new Date());
      setIsDirty(false);
    } catch { /* localStorage full */ }
  }, []);

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      persistDraft(formDataRef.current);
    }, 2000);
  }, [persistDraft]);

  const updateField = useCallback(<T extends FormSection>(
    section: T,
    field: keyof FormData[T],
    value: unknown
  ) => {
    setFormData(prev => {
      const next = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
      formDataRef.current = next;
      return next;
    });
    setIsDirty(true);
    scheduleSave();
  }, [scheduleSave]);

  const updateSection = useCallback(<T extends FormSection>(
    section: T,
    data: Partial<FormData[T]>
  ) => {
    setFormData(prev => {
      const next = {
        ...prev,
        [section]: {
          ...prev[section],
          ...data,
        },
      };
      formDataRef.current = next;
      return next;
    });
    setIsDirty(true);
    scheduleSave();
  }, [scheduleSave]);

  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearErrors = useCallback(() => { setErrors({}); }, []);

  const validateStep = useCallback((step: number): boolean => {
    const errs: ValidationErrors = {};

    switch (step) {
      case 1: {
        const ci = formData.companyInfo;
        if (!ci.companyName.trim()) errs['companyInfo.companyName'] = 'Company name is required';
        else if (ci.companyName.trim().length < 2) errs['companyInfo.companyName'] = 'Must be at least 2 characters';
        if (!ci.industry) errs['companyInfo.industry'] = 'Please select an industry';
        if (!ci.contactPerson.trim()) errs['companyInfo.contactPerson'] = 'Contact person is required';
        if (!ci.position.trim()) errs['companyInfo.position'] = 'Position is required';
        if (!ci.phone.trim()) errs['companyInfo.phone'] = 'Phone number is required';
        else if (!/^[+]?[\d\s\-\(\)]{7,}$/.test(ci.phone.trim())) errs['companyInfo.phone'] = 'Please enter a valid phone number';
        if (!ci.email.trim()) errs['companyInfo.email'] = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ci.email.trim())) errs['companyInfo.email'] = 'Please enter a valid email';
        break;
      }
      case 2: {
        const bo = formData.businessOverview;
        if (!bo.description.trim()) errs['businessOverview.description'] = 'Business description is required';
        else if (bo.description.trim().length < 50) errs['businessOverview.description'] = 'Please provide at least 50 characters';
        if (!bo.productsServices.trim()) errs['businessOverview.productsServices'] = 'Products/services is required';
        if (!bo.goals.trim()) errs['businessOverview.goals'] = 'Business goals are required';
        break;
      }
      case 3: {
        const pt = formData.projectType;
        if (pt.selected.length === 0) errs['projectType.selected'] = 'Please select at least one project type';
        if (pt.selected.includes('custom-software') && !pt.otherDescription.trim()) {
          errs['projectType.otherDescription'] = 'Please describe your custom project';
        }
        break;
      }
      case 4: {
        const pg = formData.projectGoals;
        if (!pg.why.trim()) errs['projectGoals.why'] = 'This field is required';
        else if (pg.why.trim().length < 30) errs['projectGoals.why'] = 'Please provide at least 30 characters';
        if (!pg.problem.trim()) errs['projectGoals.problem'] = 'This field is required';
        else if (pg.problem.trim().length < 30) errs['projectGoals.problem'] = 'Please provide at least 30 characters';
        if (!pg.success.trim()) errs['projectGoals.success'] = 'This field is required';
        else if (pg.success.trim().length < 30) errs['projectGoals.success'] = 'Please provide at least 30 characters';
        break;
      }
      case 5: {
        const rf = formData.requiredFeatures;
        if (rf.selected.length === 0) errs['requiredFeatures.selected'] = 'Please select at least one feature';
        break;
      }
      case 6: {
        const dp = formData.designPreferences;
        if (dp.style.length === 0) errs['designPreferences.style'] = 'Please select at least one design style';
        break;
      }
      case 8: {
        const tr = formData.technicalRequirements;
        if (!tr.domain) errs['technicalRequirements.domain'] = 'Please select a domain option';
        if (!tr.hosting) errs['technicalRequirements.hosting'] = 'Please select a hosting option';
        if (!tr.email) errs['technicalRequirements.email'] = 'Please select an email option';
        break;
      }
      case 9: {
        const tb = formData.timelineBudget;
        if (!tb.launchDate) errs['timelineBudget.launchDate'] = 'Please select a target date';
        else {
          const minDate = new Date();
          minDate.setDate(minDate.getDate() + 14);
          if (new Date(tb.launchDate) < minDate) errs['timelineBudget.launchDate'] = 'Date must be at least 2 weeks from today';
        }
        if (!tb.urgency) errs['timelineBudget.urgency'] = 'Please select urgency level';
        if (!tb.budgetRange) errs['timelineBudget.budgetRange'] = 'Please select a budget range';
        break;
      }
      case 10: {
        const si = formData.strategicIntelligence;
        if (!si.challenges.trim()) errs['strategicIntelligence.challenges'] = 'This field is required';
        else if (si.challenges.trim().length < 30) errs['strategicIntelligence.challenges'] = 'Please provide at least 30 characters';
        if (!si.automate.trim()) errs['strategicIntelligence.automate'] = 'This field is required';
        break;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  const getStepErrors = useCallback((step: number): ValidationErrors => {
    validateStep(step);
    return errors;
  }, [validateStep, errors]);

  // Public saveDraft — always reads latest from ref
  const saveDraft = useCallback(() => {
    persistDraft(formDataRef.current);
  }, [persistDraft]);

  const loadDraft = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = { ...defaultFormData, ...JSON.parse(saved) };
        setFormData(parsed);
        formDataRef.current = parsed;
        return true;
      }
    } catch { /* ignore */ }
    return false;
  }, []);

  const hasDraft = useCallback((): boolean => {
    return localStorage.getItem(DRAFT_KEY) !== null;
  }, []);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      persistDraft(formDataRef.current);
    };
  }, [persistDraft]);

  return (
    <FormContext.Provider
      value={{
        formData,
        errors,
        updateField,
        updateSection,
        setError,
        clearError,
        clearErrors,
        validateStep,
        getStepErrors,
        saveDraft,
        loadDraft,
        hasDraft,
        lastSaved,
        isDirty,
        submissionId,
        setSubmissionId,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormStore(): FormStore {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormStore must be used within FormProvider');
  return context;
}
