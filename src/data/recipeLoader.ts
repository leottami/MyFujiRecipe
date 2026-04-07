import type { Recipe } from "./types";

let cachedRecipes: Recipe[] | null = null;

export async function loadRecipes(): Promise<Recipe[]> {
	if (cachedRecipes) return cachedRecipes;

	const response = await fetch(`${import.meta.env.BASE_URL}data/recipes.json`);
	if (!response.ok) {
		throw new Error(`Failed to load recipes: ${response.status}`);
	}

	const recipes: Recipe[] = await response.json();
	cachedRecipes = recipes;
	return recipes;
}

export async function loadRecipe(id: string): Promise<Recipe | null> {
	const recipes = await loadRecipes();
	return recipes.find((r) => r.id === id) ?? null;
}
