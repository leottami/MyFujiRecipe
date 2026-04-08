import { createContext, use, type ReactNode } from "react";
import type { RecipeRepository } from "./RecipeRepository";

const RecipeRepositoryContext = createContext<RecipeRepository | null>(null);

interface RecipeProviderProps {
	repository: RecipeRepository;
	children: ReactNode;
}

export function RecipeProvider({ repository, children }: RecipeProviderProps) {
	return (
		<RecipeRepositoryContext.Provider value={repository}>
			{children}
		</RecipeRepositoryContext.Provider>
	);
}

export function useRepository(): RecipeRepository {
	const repo = use(RecipeRepositoryContext);
	if (!repo) {
		throw new Error(
			"useRepository must be used within a RecipeProvider",
		);
	}
	return repo;
}
