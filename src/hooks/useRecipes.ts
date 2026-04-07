import { useEffect, useState } from "react";
import { loadRecipe, loadRecipes } from "../data/recipeLoader";
import type { Recipe } from "../data/types";

export function useRecipes() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadRecipes()
			.then(setRecipes)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load recipes");
			})
			.finally(() => setLoading(false));
	}, []);

	return { recipes, loading, error };
}

export function useRecipe(id: string | undefined) {
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) {
			setLoading(false);
			return;
		}

		loadRecipe(id)
			.then(setRecipe)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load recipe");
			})
			.finally(() => setLoading(false));
	}, [id]);

	return { recipe, loading, error };
}
