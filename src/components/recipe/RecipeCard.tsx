import { Link } from "react-router-dom";
import type { Recipe } from "../../data/types";
import { extractAuthor, extractAuthorId, getHeroPhoto } from "../../data/utils";
import { useFavorites } from "../../hooks/useFavorites";
import { HeroImage } from "./HeroImage";

interface RecipeCardProps {
	recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
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
					className="w-full group-hover:scale-[1.03] transition-transform duration-700 ease-out"
					aspectRatio="3/2"
				/>

				{/* Gradient overlay on hover */}
				<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

				{/* Favorite heart — bottom left, only visible on hover unless favorited */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						toggleFavorite(recipe.id);
					}}
					className={`absolute bottom-3 left-3 transition-all duration-300 ${
						favorited
							? "opacity-100"
							: "opacity-0 group-hover:opacity-100"
					}`}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill={favorited ? "#b91e25" : "none"}
						stroke={favorited ? "#b91e25" : "#ffffff"}
						strokeWidth="2"
						className="drop-shadow-sm"
						aria-hidden="true"
					>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
				</button>

				{/* Film simulation badge */}
				<span className="absolute bottom-3 right-3 bg-inverse-surface/60 backdrop-blur-sm text-inverse-on-surface font-label text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					{recipe.filmSimulation}
				</span>
			</div>

			<div className="pt-3 pb-1">
				<h3 className="font-headline font-semibold text-[15px] text-on-surface group-hover:text-primary transition-colors duration-300 leading-tight mb-1">
					{recipe.name}
				</h3>
				<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 mb-2">
					<Link
						to={`/photographer/${extractAuthorId(recipe.url)}`}
						onClick={(e) => e.stopPropagation()}
						className="hover:text-on-surface transition-colors"
					>
						{author}
					</Link>
					<span className="mx-2 text-outline-variant/30">/</span>
					<span>{recipe.dynamicRange ?? "DR Auto"}</span>
				</p>
			</div>
		</Link>
	);
}
