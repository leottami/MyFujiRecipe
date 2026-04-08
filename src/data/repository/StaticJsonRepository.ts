import type {
	Recipe,
	RecipeCreateInput,
	RecipeUpdateInput,
	Result,
} from "../types";
import type { RecipeRepository } from "./RecipeRepository";

const STORAGE_KEY = "iamfuji_recipes_overlay";

interface LocalOverlay {
	created: Recipe[];
	updated: Record<string, Partial<Recipe>>;
	deleted: string[];
}

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

function normalizeRecipe(raw: Omit<Recipe, "photos" | "tags"> & { photos?: Recipe["photos"]; tags?: Recipe["tags"] }): Recipe {
	return {
		...raw,
		photos: raw.photos?.length
			? raw.photos
			: raw.thumbnailUrl
				? [{ id: `${raw.id}-hero`, url: raw.thumbnailUrl, role: "hero" as const }]
				: [],
		tags: raw.tags ?? [],
	};
}

const EMPTY_OVERLAY: LocalOverlay = { created: [], updated: {}, deleted: [] };

function isValidOverlay(obj: unknown): obj is LocalOverlay {
	return (
		obj !== null &&
		typeof obj === "object" &&
		"created" in obj && Array.isArray((obj as LocalOverlay).created) &&
		"updated" in obj && typeof (obj as LocalOverlay).updated === "object" &&
		"deleted" in obj && Array.isArray((obj as LocalOverlay).deleted)
	);
}

function readOverlay(): LocalOverlay {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return EMPTY_OVERLAY;
		const parsed: unknown = JSON.parse(stored);
		return isValidOverlay(parsed) ? parsed : EMPTY_OVERLAY;
	} catch {
		return EMPTY_OVERLAY;
	}
}

function writeOverlay(overlay: LocalOverlay): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
}

function ok<T>(data: T): Result<T> {
	return { data, error: null };
}

function err<T>(code: string, message: string): Result<T> {
	return { data: null, error: { code, message } };
}

export class StaticJsonRepository implements RecipeRepository {
	private cache: Recipe[] | null = null;

	private async fetchBase(): Promise<Recipe[]> {
		if (this.cache) return this.cache;

		const response = await fetch(
			`${import.meta.env.BASE_URL}data/recipes.json`,
		);
		if (!response.ok) {
			throw new Error(`Failed to load recipes: ${response.status}`);
		}

		const raw: Recipe[] = await response.json();
		this.cache = raw.map(normalizeRecipe);
		return this.cache;
	}

	private applyOverlay(base: Recipe[]): Recipe[] {
		const overlay = readOverlay();

		let recipes = base
			.filter((r) => !overlay.deleted.includes(r.id))
			.map((r) => {
				const updates = overlay.updated[r.id];
				return updates ? normalizeRecipe({ ...r, ...updates }) : r;
			});

		recipes = [...recipes, ...overlay.created];
		return recipes;
	}

	async getAll(): Promise<Result<Recipe[]>> {
		try {
			const base = await this.fetchBase();
			return ok(this.applyOverlay(base));
		} catch (e) {
			return err(
				"FETCH_FAILED",
				e instanceof Error ? e.message : "Failed to load recipes",
			);
		}
	}

	async getById(id: string): Promise<Result<Recipe | null>> {
		const result = await this.getAll();
		if (result.error) return result as Result<Recipe | null>;
		return ok(result.data.find((r) => r.id === id) ?? null);
	}

	async create(input: RecipeCreateInput): Promise<Result<Recipe>> {
		const allResult = await this.getAll();
		if (allResult.error) return allResult as Result<Recipe>;

		const baseId = slugify(input.name);
		const existing = allResult.data.filter((r) => r.id === baseId || r.id.startsWith(`${baseId}-`));
		const id = existing.length > 0 ? `${baseId}-${existing.length}` : baseId;

		const now = new Date().toISOString();
		const recipe: Recipe = {
			...input,
			id,
			createdAt: now,
			updatedAt: now,
		};

		const overlay = readOverlay();
		overlay.created.push(recipe);
		writeOverlay(overlay);

		return ok(recipe);
	}

	async update(input: RecipeUpdateInput): Promise<Result<Recipe>> {
		const allResult = await this.getAll();
		if (allResult.error) return allResult as Result<Recipe>;

		const existing = allResult.data.find((r) => r.id === input.id);
		if (!existing) return err("NOT_FOUND", `Recipe "${input.id}" not found`);

		const { id: _, ...changes } = input;
		const updated = normalizeRecipe({
			...existing,
			...changes,
			updatedAt: new Date().toISOString(),
		});

		const overlay = readOverlay();
		const createdIdx = overlay.created.findIndex((r) => r.id === input.id);
		if (createdIdx >= 0) {
			overlay.created[createdIdx] = updated;
		} else {
			overlay.updated[input.id] = { ...overlay.updated[input.id], ...changes, updatedAt: updated.updatedAt };
		}
		writeOverlay(overlay);

		return ok(updated);
	}

	async delete(id: string): Promise<Result<void>> {
		const allResult = await this.getAll();
		if (allResult.error) return allResult as Result<void>;

		const existing = allResult.data.find((r) => r.id === id);
		if (!existing) return err("NOT_FOUND", `Recipe "${id}" not found`);

		const overlay = readOverlay();
		const createdIdx = overlay.created.findIndex((r) => r.id === id);
		if (createdIdx >= 0) {
			overlay.created.splice(createdIdx, 1);
		} else {
			overlay.deleted.push(id);
		}
		delete overlay.updated[id];
		writeOverlay(overlay);

		return ok(undefined);
	}
}
