import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StaticJsonRepository } from "../StaticJsonRepository";
import type { RecipeCreateInput } from "../../types";

const mockRecipes = [
	{
		id: "kodachrome-64",
		name: "Kodachrome 64",
		url: "https://fujixweekly.com/kodachrome-64",
		sensor: "X-Trans IV",
		publishedDate: "2020-05-27",
		thumbnailUrl: "https://example.com/thumb.jpg",
		filmSimulation: "Classic Chrome",
		dynamicRange: "DR200",
		highlight: "0",
		shadow: "0",
		color: "+2",
		noiseReduction: "-4",
		sharpening: "+1",
		clarity: "+3",
		grainEffect: "Weak, Small",
		colorChromeEffect: "Strong",
		colorChromeEffectBlue: "Weak",
		whiteBalance: "Daylight",
		iso: "Auto, up to ISO 6400",
		exposureCompensation: "0",
		extraSettings: {},
		tags: ["Street", "Vintage"],
	},
];

describe("StaticJsonRepository", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.stubGlobal(
			"fetch",
			vi.fn(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockRecipes),
				}),
			),
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		localStorage.clear();
	});

	it("getAll returns recipes with normalized photos", async () => {
		const repo = new StaticJsonRepository();
		const result = await repo.getAll();

		expect(result.error).toBeNull();
		expect(result.data).toHaveLength(1);
		expect(result.data?.[0]?.photos).toHaveLength(1);
		expect(result.data?.[0]?.photos[0]?.role).toBe("hero");
	});

	it("getById returns recipe by id", async () => {
		const repo = new StaticJsonRepository();
		const result = await repo.getById("kodachrome-64");

		expect(result.error).toBeNull();
		expect(result.data?.name).toBe("Kodachrome 64");
	});

	it("getById returns null for unknown id", async () => {
		const repo = new StaticJsonRepository();
		const result = await repo.getById("nonexistent");

		expect(result.error).toBeNull();
		expect(result.data).toBeNull();
	});

	it("create adds recipe to localStorage overlay", async () => {
		const repo = new StaticJsonRepository();
		const input: RecipeCreateInput = {
			name: "My Recipe",
			url: "https://example.com",
			sensor: "X-Trans IV",
			publishedDate: "",
			thumbnailUrl: "",
			photos: [],
			filmSimulation: "Velvia",
			dynamicRange: "DR100",
			highlight: "0",
			shadow: "0",
			color: "0",
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
		};

		const result = await repo.create(input);
		expect(result.error).toBeNull();
		expect(result.data?.id).toBe("my-recipe");
		expect(result.data?.name).toBe("My Recipe");

		// Verify it appears in getAll
		const all = await repo.getAll();
		expect(all.data).toHaveLength(2);
	});

	it("update modifies recipe in overlay", async () => {
		const repo = new StaticJsonRepository();
		const result = await repo.update({
			id: "kodachrome-64",
			name: "Kodachrome 64 Updated",
		});

		expect(result.error).toBeNull();
		expect(result.data?.name).toBe("Kodachrome 64 Updated");
	});

	it("update returns error for unknown recipe", async () => {
		const repo = new StaticJsonRepository();
		const result = await repo.update({ id: "nonexistent", name: "test" });

		expect(result.error).not.toBeNull();
		expect(result.error?.code).toBe("NOT_FOUND");
	});

	it("delete removes recipe from overlay", async () => {
		const repo = new StaticJsonRepository();
		const result = await repo.delete("kodachrome-64");

		expect(result.error).toBeNull();

		const all = await repo.getAll();
		const ids = all.data?.map((r) => r.id) ?? [];
		expect(ids).not.toContain("kodachrome-64");
	});

	it("delete returns error for unknown recipe", async () => {
		const repo = new StaticJsonRepository();
		const result = await repo.delete("nonexistent");

		expect(result.error).not.toBeNull();
		expect(result.error?.code).toBe("NOT_FOUND");
	});

	it("handles fetch failure gracefully", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => Promise.resolve({ ok: false, status: 500 })),
		);

		const repo = new StaticJsonRepository();
		const result = await repo.getAll();

		expect(result.error).not.toBeNull();
		expect(result.error?.code).toBe("FETCH_FAILED");
	});
});
