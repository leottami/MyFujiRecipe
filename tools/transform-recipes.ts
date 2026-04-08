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

// Film simulation character descriptions
const SIM_CHARACTER: Record<string, string> = {
	"Classic Chrome": "muted, desaturated tones with lifted shadows — inspired by classic photojournalism",
	"Classic Negative": "high contrast with warm highlights and cool shadows — a punchy, editorial look",
	"Classic Neg.": "high contrast with warm highlights and cool shadows — a punchy, editorial look",
	"Velvia": "hyper-vivid, deeply saturated colors with rich contrast — bold and dramatic",
	"Astia": "soft, natural colors with gentle contrast — flattering for skin tones",
	"Provia": "balanced, natural rendering with moderate saturation — Fuji's standard look",
	"Pro Neg. Hi": "slightly muted with smooth tonal transitions — designed for portrait work",
	"Pro Neg. Std": "low contrast with gentle colors — soft and understated",
	"PRO Neg. Hi": "slightly muted with smooth tonal transitions — designed for portrait work",
	"Eterna": "flat, desaturated tones with muted colors — a cinematic, film-negative look",
	"Eterna Bleach Bypass": "high contrast with severely desaturated colors — gritty and dramatic",
	"Nostalgic Neg.": "amber-shifted tones with high contrast — warm, faded nostalgia",
	"Nostalgic Negative": "amber-shifted tones with high contrast — warm, faded nostalgia",
	"Reala Ace": "accurate, natural colors with low contrast — clean and modern",
	"Acros": "rich black-and-white with fine tonal gradation and deep blacks",
	"Acros+R": "black-and-white with enhanced contrast through a red filter — dramatic skies",
	"Acros+G": "black-and-white with a green filter — smooth skin tones in monochrome",
	"Acros+Ye": "black-and-white with a yellow filter — natural contrast with warm tone separation",
	"Monochrome": "straightforward black-and-white conversion with moderate contrast",
	"Monochrome+R": "high-contrast black-and-white with red filter emphasis",
	"Monochrome+G": "gentle black-and-white with green filter — good for portraits",
	"Sepia": "warm-toned monochrome with a classic sepia wash",
};

function getGrainDesc(grain: string | null): string {
	if (!grain || grain === "Off") return "Clean, grain-free rendering for maximum detail.";
	const lower = grain.toLowerCase();
	if (lower.includes("strong") && lower.includes("large"))
		return "Heavy, prominent film grain that adds raw analog texture.";
	if (lower.includes("strong"))
		return "Noticeable film grain that gives a tactile, shot-on-film character.";
	if (lower.includes("weak") && lower.includes("large"))
		return "Gentle but visible grain pattern that adds subtle organic texture.";
	return "Light film grain that adds a subtle analog feel without overwhelming detail.";
}

function getToneDesc(hl: string | null, sh: string | null, color: string | null): string {
	const h = Number.parseFloat(hl ?? "0") || 0;
	const s = Number.parseFloat(sh ?? "0") || 0;
	const c = Number.parseFloat(color ?? "0") || 0;

	const parts: string[] = [];
	if (h >= 3) parts.push("bright, airy highlights");
	else if (h <= -2) parts.push("pulled-back highlights for a softer look");
	if (s >= 2) parts.push("lifted shadows with an open, low-contrast feel");
	else if (s <= -2) parts.push("deep, rich shadows");
	if (c >= 3) parts.push("punchy, saturated colors");
	else if (c >= 1) parts.push("warm, enhanced colors");
	else if (c <= -2) parts.push("significantly desaturated, muted palette");
	else if (c <= -1) parts.push("slightly subdued colors");

	if (parts.length === 0) return "Balanced tonal rendering with neutral contrast.";
	return parts.join(" and ").replace(/^./, (m) => m.toUpperCase()) + ".";
}

function getBestArticleSentence(text: string | undefined, _name: string): string | null {
	if (!text || text.length < 100) return null;

	const sentences = text
		.replace(/\s+/g, " ")
		.split(/(?<=[.!?])\s+/)
		.filter((s) => s.length > 40 && s.length < 250);

	const quality = /aesthetic|inspired|mimic|emulate|reminds|reminiscent|captures|mood|character|analog|organic|dreamy|gritty|cinematic|nostalgic|faded|saturated|vibrant|muted|creamy|punchy/i;
	const skip = /^(the fujifilm|i use|you can|click here|here are|download|check out|follow me|subscribe|share on|this is a|this recipe|this film simulation|my |i've |i was |i had |one of |after |while )/i;
	const junk = /fujifilm x-|x-t\d|x-e\d|x100|x-pro|sensor|jpeg|raw|iso \d|– .* –|instagram|youtube|website/i;

	for (const s of sentences) {
		const trimmed = s.trim();
		if (skip.test(trimmed)) continue;
		if (junk.test(trimmed)) continue;
		if (quality.test(trimmed) && trimmed.length > 60 && trimmed.length < 220) return trimmed;
	}
	return null;
}

function extractDescription(r: RawRecipe): string {
	const sim = (r.film_simulation ?? "").replace(/\s*\(.*$/, "").trim();
	const simDesc = SIM_CHARACTER[sim] ?? "a distinctive color profile";
	const grain = getGrainDesc(r.grain_effect);
	const tone = getToneDesc(r.highlight, r.shadow, r.color);
	const articleQuote = getBestArticleSentence(r.article_text, r.name);

	// Build 3-4 sentence description
	const parts: string[] = [];

	// Sentence 1: Film simulation character + what it's inspired by
	if (sim) {
		parts.push(`Built on ${sim} — ${simDesc}.`);
	}

	// Sentence 2: Tone and color rendering
	parts.push(tone);

	// Sentence 3: Grain character
	parts.push(grain);

	// Sentence 4: Best quote from article OR use-case suggestion
	if (articleQuote) {
		parts.push(articleQuote);
	} else {
		// Generate use-case from settings
		const wb = (r.white_balance ?? "").toLowerCase();
		if (wb.includes("daylight") || wb.includes("shade")) {
			parts.push("Well-suited for outdoor shooting in natural light.");
		} else if (wb.includes("tungsten") || wb.includes("fluorescent")) {
			parts.push("Tuned for indoor and artificial lighting conditions.");
		} else {
			parts.push("Versatile across a range of lighting conditions.");
		}
	}

	return parts.join(" ");
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
