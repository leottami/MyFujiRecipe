export interface RecipePhoto {
	id: string;
	url: string;
	alt?: string;
	role: "hero" | "sample";
}

export interface Recipe {
	id: string;
	name: string;
	url: string;
	sensor: string;
	publishedDate: string;
	thumbnailUrl: string;
	photos: RecipePhoto[];
	filmSimulation: string;
	dynamicRange: string;
	highlight: string;
	shadow: string;
	color: string;
	noiseReduction: string;
	sharpening: string;
	clarity: string;
	grainEffect: string;
	colorChromeEffect: string;
	colorChromeEffectBlue: string;
	whiteBalance: string;
	iso: string;
	exposureCompensation: string;
	extraSettings: Record<string, string>;
	tags: string[];
	description?: string;
	createdAt?: string;
	updatedAt?: string;
}

export type RecipeCreateInput = Omit<Recipe, "id" | "createdAt" | "updatedAt">;

export type RecipeUpdateInput = Partial<Omit<Recipe, "id">> & { id: string };

export type Result<T> =
	| { data: T; error: null }
	| { data: null; error: { code: string; message: string } };

export interface RecipeFilters {
	tags: string[];
	filmSimulation: string | null;
	grain: string | null;
	dynamicRange: string | null;
	colorChrome: string | null;
	search: string;
}
