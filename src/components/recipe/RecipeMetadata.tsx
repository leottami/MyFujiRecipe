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
		<div className="flex justify-between items-baseline py-2.5 border-b border-outline-variant/15 last:border-b-0">
			<span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
				{label}
			</span>
			<span className="font-body text-sm font-medium text-on-surface text-right">
				{value}
			</span>
		</div>
	);
}

export function RecipeMetadata({ recipe }: RecipeMetadataProps) {
	const settings: [string, string][] = [
		["Film Simulation", recipe.filmSimulation],
		["Dynamic Range", recipe.dynamicRange],
		["Highlight", recipe.highlight],
		["Shadow", recipe.shadow],
		["Color", recipe.color],
		["Noise Reduction", recipe.noiseReduction],
		["Sharpening", recipe.sharpening],
		["Clarity", recipe.clarity],
		["Grain Effect", recipe.grainEffect],
		["Color Chrome", recipe.colorChromeEffect],
		["CC Blue", recipe.colorChromeEffectBlue],
		["White Balance", recipe.whiteBalance],
		["ISO", recipe.iso],
		["Exposure Comp.", recipe.exposureCompensation],
	];

	const extraEntries = Object.entries(recipe.extraSettings);

	return (
		<div className="bg-surface-container-lowest rounded-md p-6 shadow-card">
			<h2 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant mb-4">
				Technical Settings
			</h2>
			<div>
				{settings.map(([label, value]) => (
					<SettingRow key={label} label={label} value={value} />
				))}
				{extraEntries.map(([key, value]) => (
					<SettingRow key={key} label={key} value={value} />
				))}
			</div>
		</div>
	);
}
