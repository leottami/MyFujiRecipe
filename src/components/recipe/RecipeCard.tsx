import { Link } from "react-router-dom";
import type { Recipe } from "../../data/types";
import { MetadataChip } from "../ui/MetadataChip";
import { HeroImage } from "./HeroImage";

interface RecipeCardProps {
	recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
	return (
		<Link
			to={`/recipe/${recipe.id}`}
			className="group block bg-surface-container-lowest rounded-md overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300"
		>
			<HeroImage
				src={recipe.thumbnailUrl}
				alt={`Photo taken with ${recipe.name} recipe`}
				className="w-full"
				aspectRatio="3/2"
			/>
			<div className="p-4 space-y-2">
				<h3 className="font-headline font-semibold text-base text-on-surface group-hover:text-primary transition-colors leading-tight">
					{recipe.name}
				</h3>
				<div className="flex flex-wrap gap-1.5">
					<MetadataChip label={recipe.filmSimulation} />
					{recipe.grainEffect !== "Off" && (
						<MetadataChip label={`Grain ${recipe.grainEffect}`} />
					)}
				</div>
				<p className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
					{recipe.sensor}
				</p>
			</div>
		</Link>
	);
}
