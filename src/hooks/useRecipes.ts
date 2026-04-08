import { useEffect, useState } from "react";
import { useRepository } from "../data/repository";
import type { Recipe } from "../data/types";

export function useRecipes() {
	const repo = useRepository();
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		repo.getAll()
			.then((result) => {
				if (result.error) setError(result.error.message);
				else setRecipes(result.data);
			})
			.finally(() => setLoading(false));
	}, [repo]);

	return { recipes, loading, error };
}

export function useRecipe(id: string | undefined) {
	const repo = useRepository();
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) {
			setLoading(false);
			return;
		}

		repo.getById(id)
			.then((result) => {
				if (result.error) setError(result.error.message);
				else setRecipe(result.data);
			})
			.finally(() => setLoading(false));
	}, [repo, id]);

	return { recipe, loading, error };
}
