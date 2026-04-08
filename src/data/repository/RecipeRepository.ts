import type {
	Recipe,
	RecipeCreateInput,
	RecipeUpdateInput,
	Result,
} from "../types";

export interface RecipeRepository {
	getAll(): Promise<Result<Recipe[]>>;
	getById(id: string): Promise<Result<Recipe | null>>;
	create(input: RecipeCreateInput): Promise<Result<Recipe>>;
	update(input: RecipeUpdateInput): Promise<Result<Recipe>>;
	delete(id: string): Promise<Result<void>>;
}
