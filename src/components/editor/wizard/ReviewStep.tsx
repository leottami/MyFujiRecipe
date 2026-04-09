import type { RecipeCreateInput } from "../../../data/types";
import { ResolvedImage } from "../ResolvedImage";

interface ReviewStepProps {
	fields: RecipeCreateInput;
	onGoToStep: (step: number) => void;
	saveError: string | null;
}

function ReviewSection({
	title,
	stepIndex,
	onGoToStep,
	children,
}: {
	title: string;
	stepIndex: number;
	onGoToStep: (step: number) => void;
	children: React.ReactNode;
}) {
	return (
		<div className="mb-4">
			<div className="flex justify-between items-center mb-2">
				<h3 className="font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50">
					{title}
				</h3>
				<button
					type="button"
					onClick={() => onGoToStep(stepIndex)}
					className="font-label text-[10px] uppercase tracking-[0.15em] text-primary"
				>
					Edit
				</button>
			</div>
			<div className="bg-surface-container-lowest rounded-sm p-4">
				{children}
			</div>
		</div>
	);
}

function ReviewRow({ label, value }: { label: string; value: string }) {
	if (!value) return null;
	return (
		<div className="flex justify-between py-1.5 border-b border-surface-variant/50 last:border-0">
			<span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
				{label}
			</span>
			<span className="font-body text-sm text-on-surface text-right">
				{value}
			</span>
		</div>
	);
}

export function ReviewStep({ fields, onGoToStep, saveError }: ReviewStepProps) {
	const heroPhoto = fields.photos.find((p) => p.role === "hero") ?? fields.photos[0];
	const heroUrl = heroPhoto?.url ?? fields.thumbnailUrl ?? "";

	return (
		<div className="px-4">
			<h2 className="font-headline font-bold text-lg text-on-surface mb-6">
				Review Your Recipe
			</h2>

			{/* Summary card */}
			{heroUrl && (
				<div className="bg-surface-container-lowest rounded-sm overflow-hidden shadow-card mb-6">
					<ResolvedImage
						src={heroUrl}
						alt="Recipe preview"
						className="w-full"
						aspectRatio="21/9"
					/>
					<div className="px-4 py-3">
						<p className="font-headline font-bold text-base text-on-surface">
							{fields.name || "Untitled Recipe"}
						</p>
						<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mt-0.5">
							{[fields.filmSimulation, fields.sensor].filter(Boolean).join(" · ")}
						</p>
					</div>
				</div>
			)}

			{/* Photos section */}
			{fields.photos.length > 0 && (
				<ReviewSection title={`Photos (${fields.photos.length})`} stepIndex={1} onGoToStep={onGoToStep}>
					<div className="flex gap-2 overflow-x-auto scrollbar-none">
						{fields.photos.map((photo) => (
							<div key={photo.id} className="w-16 h-12 shrink-0 rounded-sm overflow-hidden">
								<ResolvedImage
									src={photo.url}
									alt="Recipe photo"
									className="w-full h-full"
									aspectRatio="4/3"
								/>
							</div>
						))}
					</div>
				</ReviewSection>
			)}

			{/* Essentials */}
			<ReviewSection title="Essentials" stepIndex={2} onGoToStep={onGoToStep}>
				<ReviewRow label="Name" value={fields.name} />
				<ReviewRow label="Film Sim" value={fields.filmSimulation} />
				<ReviewRow label="Sensor" value={fields.sensor} />
				<ReviewRow label="DR" value={fields.dynamicRange} />
				{fields.tags.length > 0 && (
					<ReviewRow label="Tags" value={fields.tags.join(", ")} />
				)}
			</ReviewSection>

			{/* Film Settings */}
			{(fields.grainEffect || fields.colorChromeEffect || fields.colorChromeEffectBlue) && (
				<ReviewSection title="Film Settings" stepIndex={3} onGoToStep={onGoToStep}>
					<ReviewRow label="Grain" value={fields.grainEffect} />
					<ReviewRow label="Chrome" value={fields.colorChromeEffect} />
					<ReviewRow label="Chrome Blue" value={fields.colorChromeEffectBlue} />
				</ReviewSection>
			)}

			{/* Tone & Shooting */}
			{(fields.highlight || fields.shadow || fields.color || fields.whiteBalance || fields.iso) && (
				<ReviewSection title="Tone & Shooting" stepIndex={3} onGoToStep={onGoToStep}>
					<ReviewRow label="Highlight" value={fields.highlight} />
					<ReviewRow label="Shadow" value={fields.shadow} />
					<ReviewRow label="Color" value={fields.color} />
					<ReviewRow label="Sharpening" value={fields.sharpening} />
					<ReviewRow label="Clarity" value={fields.clarity} />
					<ReviewRow label="Noise Red." value={fields.noiseReduction} />
					<ReviewRow label="WB" value={fields.whiteBalance} />
					<ReviewRow label="ISO" value={fields.iso} />
					<ReviewRow label="Exposure" value={fields.exposureCompensation} />
				</ReviewSection>
			)}

			{saveError && (
				<p className="font-label text-[10px] text-error text-center mt-4">
					{saveError}
				</p>
			)}
		</div>
	);
}
