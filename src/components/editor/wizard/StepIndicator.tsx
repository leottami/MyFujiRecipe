interface StepIndicatorProps {
	currentStep: number;
	totalSteps: number;
	stepName: string;
}

export function StepIndicator({ currentStep, totalSteps, stepName }: StepIndicatorProps) {
	return (
		<div
			className="flex items-center gap-2"
			role="progressbar"
			aria-valuenow={currentStep}
			aria-valuemin={1}
			aria-valuemax={totalSteps}
			aria-label={`Step ${currentStep} of ${totalSteps}: ${stepName}`}
		>
			<div className="flex items-center gap-1.5">
				{Array.from({ length: totalSteps }, (_, i) => (
					<div
						key={i}
						className={`w-1.5 h-1.5 rounded-full transition-colors ${
							i + 1 === currentStep ? "bg-on-surface" : "bg-outline-variant"
						}`}
					/>
				))}
			</div>
			<span
				className={`font-label text-[9px] uppercase tracking-[0.15em] ${
					"text-on-surface font-semibold"
				}`}
			>
				{stepName}
			</span>
		</div>
	);
}
