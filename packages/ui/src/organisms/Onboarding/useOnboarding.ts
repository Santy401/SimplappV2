'use client';

import { useState } from 'react';

export type OnboardingStep = 'welcome' | 'profile' | 'company' | 'billing' | 'success';

export interface OnboardingData {
  userType: string;
  companyName: string;
  country: string;
  currency: string;
  companyLogo: string;
  invoicePrefix: string;
  defaultTax: string;
}

const STEPS: OnboardingStep[] = ['welcome', 'profile', 'company', 'billing', 'success'];

export const useOnboarding = (initialData?: Partial<OnboardingData>, onSubmit?: (data: OnboardingData) => Promise<void>) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    userType: '',
    companyName: '',
    country: 'Colombia',
    currency: 'COP',
    companyLogo: '',
    invoicePrefix: 'FAC',
    defaultTax: '19',
    ...initialData,
  });

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  const next = () => {
    const nextIdx = stepIndex + 1;
    if (nextIdx < STEPS.length) setCurrentStep(STEPS[nextIdx]);
  };

  const back = () => {
    const prevIdx = stepIndex - 1;
    if (prevIdx >= 0) setCurrentStep(STEPS[prevIdx]);
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleFinish = async () => {
    if (!onSubmit) {
      next();
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(data);
      setCurrentStep('success');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    data,
    isLoading,
    progress,
    stepIndex,
    next,
    back,
    updateData,
    handleFinish,
    isFirst: currentStep === 'welcome',
    isLast: currentStep === 'success',
  };
};
