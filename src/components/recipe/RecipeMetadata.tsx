import type { Recipe } from "../../data/types";

interface RecipeMetadataProps {
	recipe: Recipe;
}

interface SettingRowProps {
	label: string;
	value: string;
}

function SettingRow({ label, value }: SettingRowProps) {
	if (!value || value === "N/A" || value === "n/a") return null;

	return (
		<div className="flex justify-between items-baseline py-3 border-b border-surface-variant/10 last:border-b-0">
			<span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60">
				{label}
			</span>
			<span className="font-headline text-base font-semibold text-on-surface text-right">
				{value}
			</span>
		</div>
	);
}

interface SectionProps {
	title: string;
	children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
	return (
		<div className="mb-6 last:mb-0">
			<h3 className="accent-border-left font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-accent-warm mb-3">
				{title}
			</h3>
			<div className="bg-surface-container-lowest rounded-sm p-4">
				{children}
			</div>
		</div>
	);
}

export function RecipeMetadata({ recipe }: RecipeMetadataProps) {
	return (
		<div className="animate-slide-in-left" style={{ animationDelay: "150ms" }}>
			<h2 className="font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-6">
				Technical Specifications
			</h2>

			<Section title="Film Settings">
				<SettingRow label="Film Simulation" value={recipe.filmSimulation} />
				<SettingRow label="Dynamic Range" value={recipe.dynamicRange} />
				<SettingRow label="Grain Effect" value={recipe.grainEffect} />
				<SettingRow label="Color Chrome" value={recipe.colorChromeEffect} />
				<SettingRow label="CC Blue" value={recipe.colorChromeEffectBlue} />
			</Section>

			<Section title="Tone Curve">
				<SettingRow label="Highlight" value={recipe.highlight} />
				<SettingRow label="Shadow" value={recipe.shadow} />
				<SettingRow label="Color" value={recipe.color} />
				<SettingRow label="Sharpening" value={recipe.sharpening} />
				<SettingRow label="Clarity" value={recipe.clarity} />
				<SettingRow label="Noise Reduction" value={recipe.noiseReduction} />
			</Section>

			<Section title="Shooting Settings">
				<SettingRow label="White Balance" value={recipe.whiteBalance} />
				<SettingRow label="ISO" value={recipe.iso} />
				<SettingRow
					label="Exposure Comp."
					value={recipe.exposureCompensation}
				/>
			</Section>

			{Object.keys(recipe.extraSettings).length > 0 && (
				<Section title="Additional">
					{Object.entries(recipe.extraSettings).map(([key, value]) => (
						<SettingRow key={key} label={key} value={value} />
					))}
				</Section>
			)}
		</div>
	);
}
