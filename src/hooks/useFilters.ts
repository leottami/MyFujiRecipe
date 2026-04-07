import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Recipe, RecipeFilters } from "../data/types";

export function useFilters(recipes: Recipe[]) {
	const [searchParams, setSearchParams] = useSearchParams();

	const filters: RecipeFilters = useMemo(
		() => ({
			filmSimulation: searchParams.get("sim"),
			search: searchParams.get("q") ?? "",
		}),
		[searchParams],
	);

	const setFilter = useCallback(
		(key: "filmSimulation" | "search", value: string | null) => {
			setSearchParams((prev) => {
				const next = new URLSearchParams(prev);
				const paramKey = key === "filmSimulation" ? "sim" : "q";
				if (value) {
					next.set(paramKey, value);
				} else {
					next.delete(paramKey);
				}
				return next;
			});
		},
		[setSearchParams],
	);

	const filmSimulations = useMemo(() => {
		const sims = new Set(recipes.map((r) => r.filmSimulation));
		return [...sims].sort();
	}, [recipes]);

	const filtered = useMemo(() => {
		let result = recipes;

		if (filters.filmSimulation) {
			result = result.filter(
				(r) => r.filmSimulation === filters.filmSimulation,
			);
		}

		if (filters.search) {
			const q = filters.search.toLowerCase();
			result = result.filter(
				(r) =>
					r.name.toLowerCase().includes(q) ||
					r.filmSimulation.toLowerCase().includes(q),
			);
		}

		return result;
	}, [recipes, filters]);

	return { filters, setFilter, filtered, filmSimulations };
}
