import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
	getFilterCounts,
	normalizeCC,
	normalizeDR,
	normalizeGrain,
} from "../data/filterHelpers";
import type { Recipe, RecipeFilters } from "../data/types";

const PARAM_MAP = {
	tags: "tags",
	filmSimulation: "sim",
	grain: "grain",
	dynamicRange: "dr",
	colorChrome: "cc",
	search: "q",
} as const;

export function useFilters(recipes: Recipe[]) {
	const [searchParams, setSearchParams] = useSearchParams();

	const filters: RecipeFilters = useMemo(
		() => ({
			tags: searchParams.get(PARAM_MAP.tags)?.split(",").filter(Boolean) ?? [],
			filmSimulation: searchParams.get(PARAM_MAP.filmSimulation),
			grain: searchParams.get(PARAM_MAP.grain),
			dynamicRange: searchParams.get(PARAM_MAP.dynamicRange),
			colorChrome: searchParams.get(PARAM_MAP.colorChrome),
			search: searchParams.get(PARAM_MAP.search) ?? "",
		}),
		[searchParams],
	);

	const setFilter = useCallback(
		(key: keyof RecipeFilters, value: string | string[] | null) => {
			setSearchParams((prev) => {
				const next = new URLSearchParams(prev);
				const paramKey = PARAM_MAP[key];

				if (Array.isArray(value)) {
					if (value.length > 0) {
						next.set(paramKey, value.join(","));
					} else {
						next.delete(paramKey);
					}
				} else if (value) {
					next.set(paramKey, value);
				} else {
					next.delete(paramKey);
				}
				return next;
			});
		},
		[setSearchParams],
	);

	const toggleTag = useCallback(
		(tag: string) => {
			const current = filters.tags;
			const next = current.includes(tag)
				? current.filter((t) => t !== tag)
				: [...current, tag];
			setFilter("tags", next);
		},
		[filters.tags, setFilter],
	);

	const clearAll = useCallback(() => {
		setSearchParams(new URLSearchParams());
	}, [setSearchParams]);

	const activeFilterCount = useMemo(() => {
		let count = 0;
		if (filters.tags.length > 0) count += filters.tags.length;
		if (filters.filmSimulation) count++;
		if (filters.grain) count++;
		if (filters.dynamicRange) count++;
		if (filters.colorChrome) count++;
		return count;
	}, [filters]);

	const filmSimulations = useMemo(() => {
		const sims = new Set(recipes.map((r) => r.filmSimulation).filter(Boolean));
		return [...sims].sort();
	}, [recipes]);

	const filtered = useMemo(() => {
		let result = recipes;

		// Tags (AND — recipe must have ALL selected tags)
		if (filters.tags.length > 0) {
			result = result.filter((r) =>
				filters.tags.every((tag) => r.tags?.includes(tag)),
			);
		}

		// Film simulation
		if (filters.filmSimulation) {
			result = result.filter(
				(r) => r.filmSimulation === filters.filmSimulation,
			);
		}

		// Grain
		if (filters.grain) {
			result = result.filter(
				(r) => normalizeGrain(r.grainEffect) === filters.grain,
			);
		}

		// Dynamic range
		if (filters.dynamicRange) {
			result = result.filter(
				(r) => normalizeDR(r.dynamicRange) === filters.dynamicRange,
			);
		}

		// Color chrome
		if (filters.colorChrome) {
			result = result.filter(
				(r) => normalizeCC(r.colorChromeEffect) === filters.colorChrome,
			);
		}

		// Search (across multiple fields)
		if (filters.search) {
			const q = filters.search.toLowerCase();
			result = result.filter(
				(r) =>
					r.name.toLowerCase().includes(q) ||
					(r.filmSimulation ?? "").toLowerCase().includes(q) ||
					(r.whiteBalance ?? "").toLowerCase().includes(q) ||
					(r.grainEffect ?? "").toLowerCase().includes(q) ||
					(r.description ?? "").toLowerCase().includes(q) ||
					(r.tags ?? []).some((t) => t.toLowerCase().includes(q)),
			);
		}

		return result;
	}, [recipes, filters]);

	const counts = useMemo(() => getFilterCounts(recipes), [recipes]);

	return {
		filters,
		setFilter,
		toggleTag,
		clearAll,
		activeFilterCount,
		filtered,
		filmSimulations,
		counts,
	};
}
