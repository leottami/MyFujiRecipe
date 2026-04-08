import type { Recipe } from "./types";

export function normalizeGrain(raw: string | null | undefined): string {
	if (!raw || raw === "Off") return "Off";
	const lower = raw.toLowerCase();
	if (lower.startsWith("strong")) return "Strong";
	if (lower.startsWith("weak")) return "Weak";
	return raw;
}

export function normalizeDR(raw: string | null | undefined): string {
	if (!raw) return "DR Auto";
	if (raw.startsWith("DR")) return raw.split(",")[0]?.trim() ?? raw;
	return raw;
}

export function normalizeCC(raw: string | null | undefined): string {
	if (!raw || raw === "Off") return "Off";
	return raw;
}

export interface FilterCounts {
	tags: Record<string, number>;
	filmSimulations: Record<string, number>;
	grain: Record<string, number>;
	dynamicRange: Record<string, number>;
	colorChrome: Record<string, number>;
}

export function getFilterCounts(recipes: Recipe[]): FilterCounts {
	const counts: FilterCounts = {
		tags: {},
		filmSimulations: {},
		grain: {},
		dynamicRange: {},
		colorChrome: {},
	};

	for (const r of recipes) {
		// Tags
		for (const tag of r.tags ?? []) {
			counts.tags[tag] = (counts.tags[tag] ?? 0) + 1;
		}

		// Film simulation
		if (r.filmSimulation) {
			counts.filmSimulations[r.filmSimulation] =
				(counts.filmSimulations[r.filmSimulation] ?? 0) + 1;
		}

		// Grain
		const grain = normalizeGrain(r.grainEffect);
		counts.grain[grain] = (counts.grain[grain] ?? 0) + 1;

		// Dynamic Range
		const dr = normalizeDR(r.dynamicRange);
		counts.dynamicRange[dr] = (counts.dynamicRange[dr] ?? 0) + 1;

		// Color Chrome
		const cc = normalizeCC(r.colorChromeEffect);
		counts.colorChrome[cc] = (counts.colorChrome[cc] ?? 0) + 1;
	}

	return counts;
}

export const ALL_TAGS = [
	"Street",
	"Outdoor",
	"Vintage",
	"Cinematic",
	"B&W",
	"Film Look",
	"Vibrant",
	"Muted",
	"Night",
	"Indoor",
	"Golden Hour",
] as const;

export const GRAIN_OPTIONS = ["Off", "Weak", "Strong"] as const;
export const DR_OPTIONS = ["DR Auto", "DR100", "DR200", "DR400"] as const;
export const CC_OPTIONS = ["Off", "Weak", "Strong"] as const;
