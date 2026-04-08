import { describe, expect, it } from "vitest";
import type { Recipe } from "../types";
import { extractAuthor, extractAuthorId, getHeroPhoto, getSamplePhotos } from "../utils";

const baseRecipe: Recipe = {
	id: "test",
	name: "Test Recipe",
	url: "https://fujixweekly.com/2020/05/test",
	sensor: "X-Trans IV",
	publishedDate: "2020-05-01",
	thumbnailUrl: "https://example.com/thumb.jpg",
	photos: [],
	filmSimulation: "Classic Chrome",
	dynamicRange: "DR200",
	highlight: "0",
	shadow: "0",
	color: "0",
	noiseReduction: "0",
	sharpening: "0",
	clarity: "0",
	grainEffect: "Off",
	colorChromeEffect: "Off",
	colorChromeEffectBlue: "Off",
	whiteBalance: "Daylight",
	iso: "Auto",
	exposureCompensation: "0",
	extraSettings: {},
	tags: [],
};

describe("getHeroPhoto", () => {
	it("returns hero photo URL when photos array has a hero", () => {
		const recipe = {
			...baseRecipe,
			photos: [
				{ id: "1", url: "https://example.com/hero.jpg", role: "hero" as const },
				{ id: "2", url: "https://example.com/sample.jpg", role: "sample" as const },
			],
		};
		expect(getHeroPhoto(recipe)).toBe("https://example.com/hero.jpg");
	});

	it("falls back to thumbnailUrl when no hero photo", () => {
		const recipe = {
			...baseRecipe,
			photos: [
				{ id: "1", url: "https://example.com/sample.jpg", role: "sample" as const },
			],
		};
		expect(getHeroPhoto(recipe)).toBe("https://example.com/thumb.jpg");
	});

	it("falls back to thumbnailUrl when photos array is empty", () => {
		expect(getHeroPhoto(baseRecipe)).toBe("https://example.com/thumb.jpg");
	});
});

describe("getSamplePhotos", () => {
	it("returns only sample photos", () => {
		const recipe = {
			...baseRecipe,
			photos: [
				{ id: "1", url: "hero.jpg", role: "hero" as const },
				{ id: "2", url: "sample1.jpg", role: "sample" as const },
				{ id: "3", url: "sample2.jpg", role: "sample" as const },
			],
		};
		const samples = getSamplePhotos(recipe);
		expect(samples).toHaveLength(2);
		expect(samples[0]?.url).toBe("sample1.jpg");
	});

	it("returns empty array when no samples", () => {
		expect(getSamplePhotos(baseRecipe)).toEqual([]);
	});
});

describe("extractAuthorId", () => {
	it("extracts domain name from URL", () => {
		expect(extractAuthorId("https://fujixweekly.com/some/path")).toBe("fujixweekly");
	});

	it("strips www prefix", () => {
		expect(extractAuthorId("https://www.fujixweekly.com/path")).toBe("fujixweekly");
	});

	it("returns 'archive' for invalid URLs", () => {
		expect(extractAuthorId("not-a-url")).toBe("archive");
		expect(extractAuthorId("")).toBe("archive");
	});
});

describe("extractAuthor", () => {
	it("returns formatted author name", () => {
		expect(extractAuthor("https://fujixweekly.com/path")).toBe("@FUJIXWEEKLY");
	});

	it("replaces hyphens with underscores", () => {
		expect(extractAuthor("https://fuji-weekly.com/path")).toBe("@FUJI_WEEKLY");
	});

	it("returns @ARCHIVE for invalid URLs", () => {
		expect(extractAuthor("bad-url")).toBe("@ARCHIVE");
	});
});
