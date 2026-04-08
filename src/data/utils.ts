import type { Recipe, RecipePhoto } from "./types";

export function getHeroPhoto(recipe: Recipe): string {
	const hero = recipe.photos.find((p) => p.role === "hero");
	return hero?.url ?? recipe.thumbnailUrl;
}

export function getSamplePhotos(recipe: Recipe): RecipePhoto[] {
	return recipe.photos.filter((p) => p.role === "sample");
}

export function extractAuthor(url: string): string {
	try {
		const host = new URL(url).hostname.replace("www.", "");
		const name = host.split(".")[0] ?? "archive";
		return `@${name.toUpperCase().replace(/-/g, "_")}`;
	} catch {
		return "@ARCHIVE";
	}
}
