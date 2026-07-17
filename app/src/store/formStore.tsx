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

const DRAFT_KEY = 'melhek-bdra-draft';

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
        const bi = formData.businessInfo;
        if (!bi.businessName.trim()) errs['businessInfo.businessName'] = 'Business name is required';
        else if (bi.businessName.trim().length < 2) errs['businessInfo.businessName'] = 'Must be at least 2 characters';
        if (!bi.industry) errs['businessInfo.industry'] = 'Please select an industry';
        if (!bi.businessType) errs['businessInfo.businessType'] = 'Please select a business type';
        if (!bi.contactPerson.trim()) errs['businessInfo.contactPerson'] = 'Contact person is required';
        if (!bi.position.trim()) errs['businessInfo.position'] = 'Position is required';
        if (!bi.phone.trim()) errs['businessInfo.phone'] = 'Phone number is required';
        else if (!/^[+]?[\d\s\-\(\)]{7,}$/.test(bi.phone.trim())) errs['businessInfo.phone'] = 'Please enter a valid phone number';
        if (!bi.email.trim()) errs['businessInfo.email'] = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bi.email.trim())) errs['businessInfo.email'] = 'Please enter a valid email address';
        break;
      }
      case 2: {
        const bo = formData.businessOverview;
        if (!bo.yearsInOperation.trim()) errs['businessOverview.yearsInOperation'] = 'Years in operation is required';
        if (!bo.productsServices.trim()) errs['businessOverview.productsServices'] = 'Please describe your main products or services';
        else if (bo.productsServices.trim().length < 20) errs['businessOverview.productsServices'] = 'Please provide at least 20 characters';
        if (!bo.businessGoals.trim()) errs['businessOverview.businessGoals'] = 'Business goals are required';
        else if (bo.businessGoals.trim().length < 20) errs['businessOverview.businessGoals'] = 'Please provide at least 20 characters';
        break;
      }
      // Steps 3–8 and 11: qualitative / optional — no hard block
      case 9: {
        const pg = formData.projectGoals;
        if (!pg.whyNow.trim()) errs['projectGoals.whyNow'] = 'This field is required';
        else if (pg.whyNow.trim().length < 20) errs['projectGoals.whyNow'] = 'Please provide at least 20 characters';
        if (!pg.successDefinition.trim()) errs['projectGoals.successDefinition'] = 'This field is required';
        else if (pg.successDefinition.trim().length < 20) errs['projectGoals.successDefinition'] = 'Please provide at least 20 characters';
        break;
      }
      case 10: {
        const pq = formData.projectQualification;
        if (!pq.urgency) errs['projectQualification.urgency'] = 'Please select project urgency';
        if (!pq.decisionMaker) errs['projectQualification.decisionMaker'] = 'Please indicate the decision maker';
        if (!pq.budgetAllocated) errs['projectQualification.budgetAllocated'] = 'Please select a budget status';
        break;
      }
      default:
        break;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  const getStepErrors = useCallback((step: number): ValidationErrors => {
    validateStep(step);
    return errors;
  }, [validateStep, errors]);

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
