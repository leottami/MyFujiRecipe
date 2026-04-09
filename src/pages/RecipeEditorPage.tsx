import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FormField, FormSelect } from "../components/editor/FormField";
import { FormSection } from "../components/editor/FormSection";
import { PhotoPreviewGrid } from "../components/editor/PhotoPreviewGrid";
import { PhotoUploadZone } from "../components/editor/PhotoUploadZone";
import { PhotoUrlField } from "../components/editor/PhotoUrlField";
import { WizardLayout } from "../components/editor/wizard/WizardLayout";
import { HeroImage } from "../components/recipe/HeroImage";
import { TagEditor } from "../components/recipe/TagEditor";
import { getHeroPhoto } from "../data/utils";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useRecipeForm } from "../hooks/useRecipeForm";
import { useRecipeMutations } from "../hooks/useRecipeMutations";
import { useRecipe } from "../hooks/useRecipes";

const FILM_SIMULATIONS = [
	"Provia",
	"Velvia",
	"Astia",
	"Classic Chrome",
	"Classic Neg.",
	"Nostalgic Neg.",
	"Reala Ace",
	"Pro Neg. Hi",
	"Pro Neg. Std",
	"Eterna",
	"Eterna Bleach Bypass",
	"Acros",
	"Acros+R",
	"Acros+G",
	"Acros+Ye",
	"Monochrome",
	"Monochrome+R",
	"Monochrome+G",
	"Sepia",
];

const SENSORS = ["X-Trans V", "X-Trans IV", "X-Trans III", "X-Trans II", "Bayer"];

const DYNAMIC_RANGE = ["DR Auto", "DR100", "DR200", "DR400"];

function RecipeEditorForm({ existingRecipe }: { existingRecipe?: NonNullable<ReturnType<typeof useRecipe>["recipe"]> }) {
	const navigate = useNavigate();
	const { fields, setField, errors, validate, isDirty } = useRecipeForm(existingRecipe ?? undefined);
	const { createRecipe, updateRecipe } = useRecipeMutations();
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	const isEdit = !!existingRecipe;

	async function handleSave() {
		const errs = validate();
		if (Object.keys(errs).length > 0) return;

		setSaving(true);
		setSaveError(null);

		const result = isEdit
			? await updateRecipe({ id: existingRecipe.id, ...fields })
			: await createRecipe(fields);

		setSaving(false);

		if (result.error) {
			setSaveError(result.error.message);
			return;
		}

		navigate(`/recipe/${result.data.id}`);
	}

	const heroUrl = fields.photos.length > 0
		? getHeroPhoto({ ...fields, id: "", createdAt: undefined, updatedAt: undefined } as Parameters<typeof getHeroPhoto>[0])
		: fields.thumbnailUrl || null;

	return (
		<div className="max-w-[800px] mx-auto px-4 lg:px-10 pb-24">
			{/* Header */}
			<div className="flex items-center justify-between py-4 mb-4">
				<Link
					to={isEdit ? `/recipe/${existingRecipe.id}` : "/"}
					className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors"
				>
					&larr; {isEdit ? "Back to Recipe" : "Back to Archive"}
				</Link>
				<h1 className="font-headline font-bold text-lg text-on-surface">
					{isEdit ? "Edit Recipe" : "New Recipe"}
				</h1>
				<Link
					to={isEdit ? `/recipe/${existingRecipe.id}` : "/"}
					className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors"
				>
					Cancel
				</Link>
			</div>

			{/* Hero Preview */}
			{heroUrl && (
				<div className="rounded-sm overflow-hidden mb-6">
					<HeroImage
						src={heroUrl}
						alt="Recipe preview"
						className="w-full"
						aspectRatio="21/9"
					/>
				</div>
			)}

			{/* Photos */}
			<FormSection title="Photos">
				<PhotoUploadZone
					photos={fields.photos}
					onChange={(photos) => setField("photos", photos)}
				/>
				{fields.photos.length > 0 && (
					<div className="mt-4">
						<PhotoPreviewGrid
							photos={fields.photos}
							onChange={(photos) => setField("photos", photos)}
						/>
					</div>
				)}
			</FormSection>

			{/* Basic Info */}
			<FormSection title="Basic Info">
				<FormField
					label="Recipe Name"
					value={fields.name}
					onChange={(v) => setField("name", v)}
					error={errors.name}
					placeholder="e.g. Kodachrome 64"
				/>
				<FormField
					label="Source URL"
					value={fields.url}
					onChange={(v) => setField("url", v)}
					placeholder="https://..."
				/>
				<FormSelect
					label="Sensor"
					value={fields.sensor}
					onChange={(v) => setField("sensor", v)}
					options={SENSORS}
				/>
			</FormSection>

			{/* Tags */}
			<FormSection title="Tags">
				<TagEditor
					tags={fields.tags}
					onChange={(newTags) => setField("tags", newTags)}
				/>
			</FormSection>

			{/* Film Settings */}
			<FormSection title="Film Settings">
				<FormSelect
					label="Film Simulation"
					value={fields.filmSimulation}
					onChange={(v) => setField("filmSimulation", v)}
					options={FILM_SIMULATIONS}
					error={errors.filmSimulation}
				/>
				<FormSelect
					label="Dynamic Range"
					value={fields.dynamicRange}
					onChange={(v) => setField("dynamicRange", v)}
					options={DYNAMIC_RANGE}
				/>
				<FormField
					label="Grain Effect"
					value={fields.grainEffect}
					onChange={(v) => setField("grainEffect", v)}
					placeholder="e.g. Weak, Small"
				/>
				<FormField
					label="Color Chrome Effect"
					value={fields.colorChromeEffect}
					onChange={(v) => setField("colorChromeEffect", v)}
					placeholder="e.g. Strong"
				/>
				<FormField
					label="Color Chrome Blue"
					value={fields.colorChromeEffectBlue}
					onChange={(v) => setField("colorChromeEffectBlue", v)}
					placeholder="e.g. Weak"
				/>
			</FormSection>

			{/* Tone Curve */}
			<FormSection title="Tone Curve">
				<FormField
					label="Highlight"
					value={fields.highlight}
					onChange={(v) => setField("highlight", v)}
					placeholder="e.g. +1"
				/>
				<FormField
					label="Shadow"
					value={fields.shadow}
					onChange={(v) => setField("shadow", v)}
					placeholder="e.g. -2"
				/>
				<FormField
					label="Color"
					value={fields.color}
					onChange={(v) => setField("color", v)}
					placeholder="e.g. +3"
				/>
				<FormField
					label="Sharpening"
					value={fields.sharpening}
					onChange={(v) => setField("sharpening", v)}
					placeholder="e.g. +1"
				/>
				<FormField
					label="Clarity"
					value={fields.clarity}
					onChange={(v) => setField("clarity", v)}
					placeholder="e.g. +3"
				/>
				<FormField
					label="Noise Reduction"
					value={fields.noiseReduction}
					onChange={(v) => setField("noiseReduction", v)}
					placeholder="e.g. -4"
				/>
			</FormSection>

			{/* Shooting Settings */}
			<FormSection title="Shooting Settings">
				<FormField
					label="White Balance"
					value={fields.whiteBalance}
					onChange={(v) => setField("whiteBalance", v)}
					placeholder="e.g. Daylight, +2 Red & -5 Blue"
				/>
				<FormField
					label="ISO"
					value={fields.iso}
					onChange={(v) => setField("iso", v)}
					placeholder="e.g. Auto, up to ISO 6400"
				/>
				<FormField
					label="Exposure Compensation"
					value={fields.exposureCompensation}
					onChange={(v) => setField("exposureCompensation", v)}
					placeholder="e.g. 0 to +2/3"
				/>
			</FormSection>

			{/* Sticky Save Bar */}
			<div className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:relative lg:mt-8 bg-surface-container-low/80 backdrop-blur-[20px] p-4 lg:bg-transparent lg:backdrop-blur-none lg:p-0 z-40">
				{saveError && (
					<p className="font-label text-[10px] text-error mb-2 text-center">
						{saveError}
					</p>
				)}
				<button
					type="button"
					onClick={handleSave}
					disabled={saving || (!isDirty && isEdit)}
					className="w-full bg-inverse-surface text-inverse-on-surface font-label text-[10px] uppercase tracking-[0.15em] px-5 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
				>
					{saving ? "Saving..." : isEdit ? "Update Recipe" : "Create Recipe"}
				</button>
			</div>
		</div>
	);
}

export function RecipeEditorPage() {
	const { id } = useParams<{ id: string }>();
	const { recipe, loading, error } = useRecipe(id);
	const isMobile = useMediaQuery("(max-width: 1023px)");

	if (id && loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant animate-pulse">
					Loading recipe...
				</p>
			</div>
		);
	}

	if (id && (error || !recipe)) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<p className="font-label text-sm text-error">
					{error ?? "Recipe not found"}
				</p>
				<Link
					to="/"
					className="font-label text-[10px] uppercase tracking-[0.15em] text-primary hover:underline"
				>
					Return to Archive
				</Link>
			</div>
		);
	}

	if (isMobile) {
		return <WizardLayout existingRecipe={recipe ?? undefined} />;
	}

	return <RecipeEditorForm existingRecipe={recipe ?? undefined} />;
}
