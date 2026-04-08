import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

interface RawPhoto {
	url: string;
	alt: string | null;
}

interface RawRecipe {
	name: string;
	url: string;
	sensor: string;
	published_date: string;
	thumbnail_url: string;
	sample_photos?: RawPhoto[];
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
	article_text?: string;
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

function parseNumeric(val: string | null | undefined): number | null {
	if (!val) return null;
	const match = val.match(/^[+-]?\d+(\.\d+)?/);
	return match ? Number(match[0]) : null;
}

function extractIsoMax(iso: string | null | undefined): number | null {
	if (!iso) return null;
	const match = iso.match(/(\d{3,})/g);
	if (!match) return null;
	return Math.max(...match.map(Number));
}

function autoTag(r: RawRecipe): string[] {
	const tags: Set<string> = new Set();
	const name = (r.name ?? "").toLowerCase();
	const sim = (r.film_simulation ?? "").toLowerCase();
	const wb = (r.white_balance ?? "").toLowerCase();
	const grain = (r.grain_effect ?? "").toLowerCase();
	const color = parseNumeric(r.color);
	const isoMax = extractIsoMax(r.iso);

	// B&W
	if (sim.includes("acros") || sim.includes("monochrome") || sim.includes("sepia")) {
		tags.add("B&W");
	}

	// Cinematic
	if (sim.includes("eterna")) {
		tags.add("Cinematic");
	}

	// Vintage
	if (/vintage|retro|kodachrome|expired|old\b|nostalgic|kodak|agfa/.test(name)) {
		tags.add("Vintage");
	}

	// Film Look — only recipes with noticeable grain (not just "Weak, Small")
	if (grain && (grain.includes("strong") || grain.includes("large"))) {
		tags.add("Film Look");
	}

	// Vibrant
	if (sim === "velvia" || (color !== null && color >= 3)) {
		tags.add("Vibrant");
	}

	// Muted
	if (sim.includes("pro neg") || (color !== null && color <= -1)) {
		tags.add("Muted");
	}

	// Outdoor
	if (wb.includes("daylight") || wb.includes("shade")) {
		tags.add("Outdoor");
	}

	// Indoor
	if (wb.includes("fluorescent") || wb.includes("incandescent") || wb.includes("tungsten")) {
		tags.add("Indoor");
	}

	// Golden Hour
	if (wb.includes("shade") && color !== null && color >= 1) {
		tags.add("Golden Hour");
	}

	// Night — only explicit night recipes, not "Auto up to ISO 6400"
	const isoIsFixed = r.iso && !r.iso.toLowerCase().includes("auto");
	if (/night|800t|cinestill|neon|tungsten/.test(name) || (isoIsFixed && isoMax !== null && isoMax >= 3200)) {
		tags.add("Night");
	}

	// Street
	if (/street|urban/.test(name) || sim === "classic chrome" || sim === "classic neg." || sim === "classic negative") {
		tags.add("Street");
	}

	return [...tags].sort();
}

function extractDescription(r: RawRecipe): string | undefined {
	const text = r.article_text;
	if (!text || text.length < 50) return undefined;

	// Split into sentences
	const sentences = text
		.replace(/\s+/g, " ")
		.split(/(?<=[.!?])\s+/)
		.filter((s) => s.length > 30 && s.length < 300);

	// Score sentences by descriptive quality
	const descriptiveWords = /color|tone|look|feel|mood|warm|cool|vintage|film|grain|contrast|soft|sharp|vivid|muted|nostalgic|cinematic|classic|natural|organic|rich|fade|saturat|portrait|street|landscape|analog|retro|bright|dark|dramatic/i;
	const skipPatterns = /^(the fujifilm|i use|you can|click here|this is my|here are|download|available|check out|follow me|subscribe|share on)/i;

	const scored = sentences
		.filter((s) => !skipPatterns.test(s.trim()))
		.map((s) => {
			let score = 0;
			const matches = s.match(descriptiveWords);
			score += matches ? matches.length * 2 : 0;
			// Prefer sentences mentioning the recipe name
			if (r.name && s.toLowerCase().includes(r.name.toLowerCase().split(" ")[0] ?? "")) score += 3;
			// Prefer medium-length sentences
			if (s.length > 80 && s.length < 200) score += 1;
			return { text: s.trim(), score };
		})
		.sort((a, b) => b.score - a.score);

	// Take the best 1-2 sentences
	const best = scored.slice(0, 2).map((s) => s.text);
	if (best.length === 0) {
		// Fallback: first non-photo-caption sentence
		const first = sentences.find((s) => s.length > 60);
		return first?.trim();
	}
	return best.join(" ");
}

function buildPhotos(id: string, raw: RawRecipe) {
	const photos: { id: string; url: string; alt?: string; role: "hero" | "sample" }[] = [];
	if (raw.sample_photos && raw.sample_photos.length > 0) {
		for (let i = 0; i < raw.sample_photos.length; i++) {
			const p = raw.sample_photos[i];
			if (!p) continue;
			photos.push({
				id: `${id}-photo-${i}`,
				url: p.url,
				...(p.alt ? { alt: p.alt } : {}),
				role: i === 0 ? "hero" : "sample",
			});
		}
	}
	return photos;
}

const transformed = raw.map((r) => {
	const id = slugify(r.name);
	const photos = buildPhotos(id, r);
	return {
		id,
		name: r.name,
		url: r.url,
		sensor: r.sensor,
		publishedDate: r.published_date,
		thumbnailUrl: r.thumbnail_url,
		photos,
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
		tags: autoTag(r),
		description: extractDescription(r),
	};
});

ensureUniqueIds(transformed);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(transformed, null, 2));

console.log(`Transformed ${transformed.length} recipes -> ${outputPath}`);
