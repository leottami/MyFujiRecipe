import { Link } from "react-router-dom";
import type { Recipe } from "../../data/types";
import { extractAuthor, extractAuthorId, getHeroPhoto } from "../../data/utils";
import { useFavorites } from "../../hooks/useFavorites";
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
	const { isFavorite, toggleFavorite } = useFavorites();
	const favorited = isFavorite(recipe.id);

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
				{/* Favorite heart */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						toggleFavorite(recipe.id);
					}}
					className="absolute top-2.5 left-2.5 w-7 h-7 flex items-center justify-center rounded-sm bg-inverse-surface/50 backdrop-blur-sm hover:bg-inverse-surface/70 transition-colors"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill={favorited ? "#b91e25" : "none"}
						stroke={favorited ? "#b91e25" : "#ffffff"}
						strokeWidth="2"
						aria-hidden="true"
					>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
				</button>

				<span className="absolute bottom-3 right-3 bg-inverse-surface/70 backdrop-blur-sm text-inverse-on-surface font-label text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm">
					{code}
				</span>
			</div>

			<div className="pt-3 pb-1">
				<h3 className="font-headline font-semibold text-base text-on-surface group-hover:text-primary transition-colors leading-tight mb-1">
					{recipe.name}
				</h3>
				<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 mb-2.5">
					By{" "}
					<Link
						to={`/photographer/${extractAuthorId(recipe.url)}`}
						onClick={(e) => e.stopPropagation()}
						className="hover:text-primary transition-colors"
					>
						{author}
					</Link>
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
