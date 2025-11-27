interface Step {
  id: string;
  title: string;
}

interface OnboardingStepperProps {
  steps: Step[];
  currentStep: number;
}

export default function OnboardingStepper({ steps, currentStep }: OnboardingStepperProps) {
  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${index < currentStep
                ? 'bg-green-500 text-white'
                : index === currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500'
              }`}
          >
            {index < currentStep ? '✓' : index + 1}
          </div>

          <span
            className={`ml-2 text-sm font-medium
              ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}
          >
            {step.title}
          </span>

          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4
                ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}