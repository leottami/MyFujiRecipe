import { Link } from "react-router-dom";
import type { Recipe } from "../../data/types";
import { extractAuthor, getHeroPhoto } from "../../data/utils";
import { HeroImage } from "./HeroImage";

interface RecipeCardProps {
	recipe: Recipe;
}

function generateCode(name: string): string {
	const words = name.toUpperCase().split(/\s+/);
	const base = words[0] ?? "RCP";
	const suffix =
		words.length > 1 ? `.${String(words.length).padStart(2, "0")}` : "";
	return `${base.slice(0, 6)}${suffix}`;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
	const code = generateCode(recipe.name);
	const author = extractAuthor(recipe.url);

	return (
		<Link
			to={`/recipe/${recipe.id}`}
			className="group block break-inside-avoid mb-5 lg:mb-0"
		>
			<div className="relative overflow-hidden rounded-sm">
				<HeroImage
					src={getHeroPhoto(recipe)}
					alt={`Photo taken with ${recipe.name} recipe`}
					className="w-full group-hover:scale-[1.02] transition-transform duration-500"
					aspectRatio="3/2"
				/>
				<span className="absolute bottom-3 right-3 bg-inverse-surface/70 backdrop-blur-sm text-inverse-on-surface font-label text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm">
					{code}
				</span>
			</div>

			<div className="pt-3 pb-1">
				<h3 className="font-headline font-semibold text-base text-on-surface group-hover:text-primary transition-colors leading-tight mb-1">
					{recipe.name}
				</h3>
				<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 mb-2.5">
					By {author}
				</p>
				<div className="flex items-center gap-3 font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">
					<span>{(recipe.iso ?? "").replace("Auto, up to ", "") || "Auto"}</span>
					<span className="w-px h-2.5 bg-outline-variant/30" />
					<span>{recipe.dynamicRange ?? "DR Auto"}</span>
					<span className="w-px h-2.5 bg-outline-variant/30" />
					<span className="truncate">{recipe.filmSimulation}</span>
				</div>
			</div>
		</Link>
	);
}
