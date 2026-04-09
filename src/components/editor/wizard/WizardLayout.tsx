import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Recipe, RecipeCreateInput } from "../../../data/types";
import { useRecipeForm } from "../../../hooks/useRecipeForm";
import { useRecipeMutations } from "../../../hooks/useRecipeMutations";
import { EssentialsStep } from "./EssentialsStep";
import { PhotoStep } from "./PhotoStep";
import { ReviewStep } from "./ReviewStep";
import { SettingsStep } from "./SettingsStep";
import { WizardNavBar } from "./WizardNavBar";

const STEP_NAMES = ["Photos", "Essentials", "Settings", "Review"];
const TOTAL_STEPS = STEP_NAMES.length;

const FILM_SIMULATIONS = [
	"Provia", "Velvia", "Astia", "Classic Chrome", "Classic Neg.",
	"Nostalgic Neg.", "Reala Ace", "Pro Neg. Hi", "Pro Neg. Std",
	"Eterna", "Eterna Bleach Bypass", "Acros", "Acros+R", "Acros+G",
	"Acros+Ye", "Monochrome", "Monochrome+R", "Monochrome+G", "Sepia",
];
const SENSORS = ["X-Trans V", "X-Trans IV", "X-Trans III", "X-Trans II", "Bayer"];
const DYNAMIC_RANGE = ["DR Auto", "DR100", "DR200", "DR400"];

interface WizardLayoutProps {
	existingRecipe?: Recipe;
}

export function WizardLayout({ existingRecipe }: WizardLayoutProps) {
	const navigate = useNavigate();
	const { fields, setField, errors, validate, isDirty } = useRecipeForm(existingRecipe ?? undefined);
	const { createRecipe, updateRecipe } = useRecipeMutations();
	const [step, setStep] = useState(1);
	const [direction, setDirection] = useState<"next" | "prev">("next");
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const isEdit = !!existingRecipe;

	function goToStep(target: number) {
		setDirection(target > step ? "next" : "prev");
		setStep(target);
		contentRef.current?.scrollTo(0, 0);
	}

	function handleBack() {
		if (step > 1) goToStep(step - 1);
	}

	function handleNext() {
		if (step === 2) {
			const errs = validate();
			if (Object.keys(errs).length > 0) return;
		}
		if (step < TOTAL_STEPS) {
			goToStep(step + 1);
		} else {
			handleSave();
		}
	}

	async function handleSave() {
		const errs = validate();
		if (Object.keys(errs).length > 0) {
			goToStep(2);
			return;
		}

		setSaving(true);
		setSaveError(null);

		const result = isEdit
			? await updateRecipe({ id: existingRecipe.id, ...fields })
			: await createRecipe(fields as RecipeCreateInput);

		setSaving(false);

		if (result.error) {
			setSaveError(result.error.message);
			return;
		}

		navigate(`/recipe/${result.data.id}`);
	}

	const stepName = STEP_NAMES[step - 1] ?? "";
	const nextLabel = step === TOTAL_STEPS
		? saving ? "Saving..." : isEdit ? "Update" : "Create"
		: "Next";
	const nextDisabled = saving || (step === TOTAL_STEPS && !isDirty && isEdit);

	const animClass = direction === "next" ? "wizard-enter-next" : "wizard-enter-prev";

	return (
		<div className="min-h-screen flex flex-col">
			{/* Header */}
			<header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-low/80 backdrop-blur-[20px] px-4 h-14 flex items-center justify-between">
				<Link
					to={isEdit ? `/recipe/${existingRecipe.id}` : "/"}
					className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant min-w-11 min-h-11 flex items-center"
				>
					&larr; Cancel
				</Link>
				<h1 className="font-headline font-bold text-sm text-on-surface">
					{isEdit ? "Edit Recipe" : "New Recipe"}
				</h1>
				<div className="min-w-11" />
			</header>

			{/* Step content */}
			<div
				ref={contentRef}
				className="flex-1 pt-16 overflow-y-auto"
				style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom, 0px))" }}
			>
				<div key={step} className={animClass}>
					{step === 1 && (
						<PhotoStep
							photos={fields.photos}
							onChange={(photos) => setField("photos", photos)}
						/>
					)}
					{step === 2 && (
						<EssentialsStep
							fields={{
								name: fields.name,
								filmSimulation: fields.filmSimulation,
								sensor: fields.sensor,
								dynamicRange: fields.dynamicRange,
								url: fields.url,
								tags: fields.tags,
							}}
							errors={errors}
							setField={setField}
							filmSimulations={FILM_SIMULATIONS}
							sensors={SENSORS}
							dynamicRanges={DYNAMIC_RANGE}
						/>
					)}
					{step === 3 && (
						<SettingsStep fields={fields} setField={setField} />
					)}
					{step === 4 && (
						<ReviewStep
							fields={fields as RecipeCreateInput}
							onGoToStep={goToStep}
							saveError={saveError}
						/>
					)}
				</div>
			</div>

			{/* Bottom nav */}
			<WizardNavBar
				currentStep={step}
				totalSteps={TOTAL_STEPS}
				stepName={stepName}
				onBack={handleBack}
				onNext={handleNext}
				nextLabel={nextLabel}
				nextDisabled={nextDisabled}
			/>
		</div>
	);
}
