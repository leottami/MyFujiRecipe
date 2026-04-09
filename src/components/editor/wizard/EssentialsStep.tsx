import { FormField, FormSelect } from "../FormField";
import { FormSection } from "../FormSection";
import { TagEditor } from "../../recipe/TagEditor";
import type { RecipeCreateInput } from "../../../data/types";

type SetField = <K extends keyof RecipeCreateInput>(key: K, value: RecipeCreateInput[K]) => void;

interface EssentialsStepProps {
	fields: {
		name: string;
		filmSimulation: string;
		sensor: string;
		dynamicRange: string;
		url: string;
		tags: string[];
	};
	errors: Record<string, string | undefined>;
	setField: SetField;
	filmSimulations: string[];
	sensors: string[];
	dynamicRanges: string[];
}

export function EssentialsStep({
	fields,
	errors,
	setField,
	filmSimulations,
	sensors,
	dynamicRanges,
}: EssentialsStepProps) {
	return (
		<div className="px-4">
			<h2 className="font-headline font-bold text-lg text-on-surface mb-1">
				Essentials
			</h2>
			<p className="font-body text-sm text-on-surface-variant mb-6">
				Name your recipe and pick a film simulation
			</p>

			<FormSection title="Basic Info">
				<FormField
					label="Recipe Name *"
					value={fields.name}
					onChange={(v) => setField("name", v)}
					error={errors.name}
					placeholder="e.g. Kodachrome 64"
				/>
				<FormSelect
					label="Film Simulation *"
					value={fields.filmSimulation}
					onChange={(v) => setField("filmSimulation", v)}
					options={filmSimulations}
					error={errors.filmSimulation}
				/>
				<FormSelect
					label="Sensor"
					value={fields.sensor}
					onChange={(v) => setField("sensor", v)}
					options={sensors}
				/>
				<FormSelect
					label="Dynamic Range"
					value={fields.dynamicRange}
					onChange={(v) => setField("dynamicRange", v)}
					options={dynamicRanges}
				/>
				<FormField
					label="Source URL"
					value={fields.url}
					onChange={(v) => setField("url", v)}
					placeholder="https://..."
				/>
			</FormSection>

			<FormSection title="Tags">
				<TagEditor
					tags={fields.tags}
					onChange={(newTags) => setField("tags", newTags)}
				/>
			</FormSection>
		</div>
	);
}
