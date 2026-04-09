import { StepIndicator } from "./StepIndicator";

interface WizardNavBarProps {
	currentStep: number;
	totalSteps: number;
	stepName: string;
	onBack: () => void;
	onNext: () => void;
	nextLabel?: string;
	nextDisabled?: boolean;
}

export function WizardNavBar({
	currentStep,
	totalSteps,
	stepName,
	onBack,
	onNext,
	nextLabel = "Next",
	nextDisabled = false,
}: WizardNavBarProps) {
	const isFirst = currentStep === 1;

	return (
		<nav
			className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-low/80 backdrop-blur-[20px] px-4 pt-2 flex items-center justify-between"
			style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
			aria-label="Wizard navigation"
		>
			{/* Back button */}
			<button
				type="button"
				onClick={onBack}
				className={`font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant py-2 px-1 min-w-11 min-h-11 flex items-center ${
					isFirst ? "invisible" : ""
				}`}
			>
				&larr; Back
			</button>

			{/* Step indicator */}
			<StepIndicator
				currentStep={currentStep}
				totalSteps={totalSteps}
				stepName={stepName}
			/>

			{/* Next / Create button */}
			<button
				type="button"
				onClick={onNext}
				disabled={nextDisabled}
				className="bg-inverse-surface text-inverse-on-surface font-label text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 min-h-11"
			>
				{nextLabel}
			</button>
		</nav>
	);
}
