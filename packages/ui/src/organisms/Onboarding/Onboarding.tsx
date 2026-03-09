'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOnboarding, OnboardingData } from './useOnboarding';
import { OnboardingInfoPanel, OnboardingProgressBar } from './OnboardingAtoms';

// Steps
import { WelcomeStep } from './steps/welcome-step';
import { ProfileStep } from './steps/profile-step';
import { CompanyStep } from './steps/company-step';
import { BillingStep } from './steps/billing-step';
import { SuccessStep } from './steps/success-step';

interface OnboardingProps {
  initialData?: Partial<OnboardingData>;
  onSubmit: (data: OnboardingData) => Promise<void>;
  onFinish: () => void;
}

export function Onboarding({ initialData, onSubmit, onFinish }: OnboardingProps) {
  const {
    currentStep,
    data,
    isLoading,
    progress,
    stepIndex,
    next,
    back,
    updateData,
    handleFinish,
    isFirst,
    isLast
  } = useOnboarding(initialData, onSubmit);

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={next} />;
      case 'profile':
        return (
          <ProfileStep
            userType={data.userType}
            onSelect={(type) => updateData({ userType: type })}
            onNext={next}
            onBack={back}
          />
        );
      case 'company':
        return (
          <CompanyStep
            data={data}
            updateData={updateData}
            onNext={next}
            onBack={back}
          />
        );
      case 'billing':
        return (
          <BillingStep
            data={data}
            updateData={updateData}
            onFinish={handleFinish}
            onBack={back}
            isLoading={isLoading}
          />
        );
      case 'success':
        return <SuccessStep onFinish={onFinish} />;
      default:
        return null;
    }
  };

  const getStepLabel = () => {
    if (currentStep === 'welcome') return 'Comenzando';
    if (currentStep === 'success') return 'Completado';
    return `Paso ${stepIndex} de 3`;
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* Left Side: Info (Desktop only) */}
      <OnboardingInfoPanel />

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-6 py-12 lg:px-12 relative z-10">
          {/* Header Mobile Only */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-black text-lg tracking-tighter">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">Simplapp</span>
          </div>

          {/* Progress Bar (Hide on success) */}
          {currentStep !== 'success' && (
            <OnboardingProgressBar progress={progress} stepLabel={getStepLabel()} />
          )}

          {/* Step Content */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <div key={currentStep}>
                {renderStep()}
              </div>
            </AnimatePresence>
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              Seguridad de nivel bancario • Simplapp V2
            </p>
            <div className="flex gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
