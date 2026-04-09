interface HeroSectionProps {
	recipeCount: number;
}

export function HeroSection({ recipeCount }: HeroSectionProps) {
	return (
		<section className="flex items-baseline justify-between gap-4 mb-6 lg:mb-8">
			<div className="min-w-0">
				<h1 className="font-headline font-extrabold text-xl lg:text-3xl text-on-surface leading-tight tracking-[-0.02em]">
					Film Recipes
				</h1>
				<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 mt-1">
					{recipeCount} profiles · X-Trans IV
				</p>
			</div>
			<span className="shrink-0 inline-block w-1.5 h-1.5 rounded-sm bg-tertiary" />
		</section>
	);
}
