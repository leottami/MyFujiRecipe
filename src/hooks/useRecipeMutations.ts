import { useRepository } from "../data/repository";
import type { RecipeCreateInput, RecipeUpdateInput } from "../data/types";

export function useRecipeMutations() {
	const repo = useRepository();

	return {
		createRecipe: (input: RecipeCreateInput) => repo.create(input),
		updateRecipe: (input: RecipeUpdateInput) => repo.update(input),
		deleteRecipe: (id: string) => repo.delete(id),
	};
}
