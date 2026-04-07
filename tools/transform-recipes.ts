import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

interface RawRecipe {
	name: string;
	url: string;
	sensor: string;
	published_date: string;
	thumbnail_url: string;
	film_simulation: string;
	dynamic_range: string;
	highlight: string;
	shadow: string;
	color: string;
	noise_reduction: string;
	sharpening: string;
	clarity: string;
	grain_effect: string;
	color_chrome_effect: string;
	color_chrome_effect_blue: string;
	white_balance: string;
	iso: string;
	exposure_compensation: string;
	extra_settings: Record<string, string>;
}

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

function ensureUniqueIds(recipes: { id: string }[]): void {
	const seen = new Map<string, number>();
	for (const recipe of recipes) {
		const count = seen.get(recipe.id) ?? 0;
		if (count > 0) {
			recipe.id = `${recipe.id}-${count}`;
		}
		seen.set(recipe.id.replace(/-\d+$/, ""), count + 1);
	}
}

const inputPath = resolve(
	import.meta.dirname,
	"scraper/fuji_recipes_xtrans4.json",
);
const outputPath = resolve(import.meta.dirname, "../public/data/recipes.json");

const raw: RawRecipe[] = JSON.parse(readFileSync(inputPath, "utf-8"));

const transformed = raw.map((r) => ({
	id: slugify(r.name),
	name: r.name,
	url: r.url,
	sensor: r.sensor,
	publishedDate: r.published_date,
	thumbnailUrl: r.thumbnail_url,
	filmSimulation: r.film_simulation,
	dynamicRange: r.dynamic_range,
	highlight: r.highlight,
	shadow: r.shadow,
	color: r.color,
	noiseReduction: r.noise_reduction,
	sharpening: r.sharpening,
	clarity: r.clarity,
	grainEffect: r.grain_effect,
	colorChromeEffect: r.color_chrome_effect,
	colorChromeEffectBlue: r.color_chrome_effect_blue,
	whiteBalance: r.white_balance,
	iso: r.iso,
	exposureCompensation: r.exposure_compensation,
	extraSettings: r.extra_settings,
}));

ensureUniqueIds(transformed);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(transformed, null, 2));

console.log(`Transformed ${transformed.length} recipes -> ${outputPath}`);
