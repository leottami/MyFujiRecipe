export interface Recipe {
	id: string;
	name: string;
	url: string;
	sensor: string;
	publishedDate: string;
	thumbnailUrl: string;
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
}

export interface RecipeFilters {
	filmSimulation: string | null;
	search: string;
}
