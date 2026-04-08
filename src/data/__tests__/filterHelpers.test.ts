import { describe, expect, it } from "vitest";
import {
	CC_OPTIONS,
	DR_OPTIONS,
	GRAIN_OPTIONS,
	getFilterCounts,
	normalizeCC,
	normalizeDR,
	normalizeGrain,
} from "../filterHelpers";
import type { Recipe } from "../types";

describe("normalizeGrain", () => {
	it("returns 'Off' for null/undefined/empty", () => {
		expect(normalizeGrain(null)).toBe("Off");
		expect(normalizeGrain(undefined)).toBe("Off");
		expect(normalizeGrain("Off")).toBe("Off");
	});

	it("normalizes 'Weak, Small' to 'Weak'", () => {
		expect(normalizeGrain("Weak, Small")).toBe("Weak");
		expect(normalizeGrain("Weak, Large")).toBe("Weak");
	});

	it("normalizes 'Strong, Small' to 'Strong'", () => {
		expect(normalizeGrain("Strong, Small")).toBe("Strong");
		expect(normalizeGrain("Strong, Large")).toBe("Strong");
	});

	it("returns raw value for unknown patterns", () => {
		expect(normalizeGrain("Medium")).toBe("Medium");
	});
});

describe("normalizeDR", () => {
	it("returns 'DR Auto' for null/undefined", () => {
		expect(normalizeDR(null)).toBe("DR Auto");
		expect(normalizeDR(undefined)).toBe("DR Auto");
	});

	it("returns value for known DR values", () => {
		expect(normalizeDR("DR100")).toBe("DR100");
		expect(normalizeDR("DR200")).toBe("DR200");
		expect(normalizeDR("DR400")).toBe("DR400");
		expect(normalizeDR("DR Auto")).toBe("DR Auto");
	});

	it("trims after comma", () => {
		expect(normalizeDR("DR200, with priority")).toBe("DR200");
	});
});

describe("normalizeCC", () => {
	it("returns 'Off' for null/undefined", () => {
		expect(normalizeCC(null)).toBe("Off");
		expect(normalizeCC(undefined)).toBe("Off");
		expect(normalizeCC("Off")).toBe("Off");
	});

	it("returns value for Weak/Strong", () => {
		expect(normalizeCC("Weak")).toBe("Weak");
		expect(normalizeCC("Strong")).toBe("Strong");
	});
});

describe("getFilterCounts", () => {
	const recipes: Recipe[] = [
		{
			id: "1",
			name: "Test",
			url: "https://example.com",
			sensor: "X-Trans IV",
			publishedDate: "",
			thumbnailUrl: "",
			photos: [],
			filmSimulation: "Classic Chrome",
			dynamicRange: "DR200",
			highlight: "0",
			shadow: "0",
			color: "0",
			noiseReduction: "0",
			sharpening: "0",
			clarity: "0",
			grainEffect: "Weak, Small",
			colorChromeEffect: "Strong",
			colorChromeEffectBlue: "Off",
			whiteBalance: "Daylight",
			iso: "Auto",
			exposureCompensation: "0",
			extraSettings: {},
			tags: ["Street", "Outdoor"],
		},
		{
			id: "2",
			name: "Test 2",
			url: "https://example.com",
			sensor: "X-Trans IV",
			publishedDate: "",
			thumbnailUrl: "",
			photos: [],
			filmSimulation: "Velvia",
			dynamicRange: "DR400",
			highlight: "0",
			shadow: "0",
			color: "+3",
			noiseReduction: "0",
			sharpening: "0",
			clarity: "0",
			grainEffect: "Off",
			colorChromeEffect: "Off",
			colorChromeEffectBlue: "Off",
			whiteBalance: "Auto",
			iso: "Auto",
			exposureCompensation: "0",
			extraSettings: {},
			tags: ["Vibrant"],
		},
	];

	it("counts tags correctly", () => {
		const counts = getFilterCounts(recipes);
		expect(counts.tags.Street).toBe(1);
		expect(counts.tags.Outdoor).toBe(1);
		expect(counts.tags.Vibrant).toBe(1);
	});

	it("counts film simulations correctly", () => {
		const counts = getFilterCounts(recipes);
		expect(counts.filmSimulations["Classic Chrome"]).toBe(1);
		expect(counts.filmSimulations.Velvia).toBe(1);
	});

	it("normalizes grain before counting", () => {
		const counts = getFilterCounts(recipes);
		expect(counts.grain.Weak).toBe(1);
		expect(counts.grain.Off).toBe(1);
	});

	it("normalizes DR before counting", () => {
		const counts = getFilterCounts(recipes);
		expect(counts.dynamicRange.DR200).toBe(1);
		expect(counts.dynamicRange.DR400).toBe(1);
	});

	it("normalizes CC before counting", () => {
		const counts = getFilterCounts(recipes);
		expect(counts.colorChrome.Strong).toBe(1);
		expect(counts.colorChrome.Off).toBe(1);
	});
});

describe("constants", () => {
	it("has expected grain options", () => {
		expect(GRAIN_OPTIONS).toEqual(["Off", "Weak", "Strong"]);
	});

	it("has expected DR options", () => {
		expect(DR_OPTIONS).toEqual(["DR Auto", "DR100", "DR200", "DR400"]);
	});

	it("has expected CC options", () => {
		expect(CC_OPTIONS).toEqual(["Off", "Weak", "Strong"]);
	});
});
