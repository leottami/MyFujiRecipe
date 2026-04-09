import { FormField } from "../FormField";
import { FormSection } from "../FormSection";
import type { RecipeCreateInput } from "../../../data/types";

type SetField = <K extends keyof RecipeCreateInput>(key: K, value: RecipeCreateInput[K]) => void;

interface SettingsStepProps {
	fields: {
		grainEffect: string;
		colorChromeEffect: string;
		colorChromeEffectBlue: string;
		highlight: string;
		shadow: string;
		color: string;
		sharpening: string;
		clarity: string;
		noiseReduction: string;
		whiteBalance: string;
		iso: string;
		exposureCompensation: string;
	};
	setField: SetField;
}

export function SettingsStep({ fields, setField }: SettingsStepProps) {
	return (
		<div className="px-4">
			<h2 className="font-headline font-bold text-lg text-on-surface mb-1">
				Settings
			</h2>
			<p className="font-body text-sm text-on-surface-variant mb-4">
				Fine-tune your recipe parameters
			</p>

			<div className="bg-primary-container/50 rounded-sm px-4 py-3 mb-6">
				<p className="font-body text-xs text-on-primary-container">
					All settings are optional. Leave blank to use defaults.
				</p>
			</div>

			<FormSection title="Film Settings">
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
		</div>
	);
}
