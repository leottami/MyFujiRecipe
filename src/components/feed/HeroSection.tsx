export function HeroSection() {
	return (
		<section className="animate-hero-reveal -mx-4 lg:-mx-10 px-4 lg:px-10 py-10 lg:py-16 mb-8 lg:mb-14 bg-editorial-dark overflow-hidden relative">
			{/* Subtle radial glow */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,149,106,0.06),transparent_60%)]" />

			<div className="relative">
				<p className="font-label text-[10px] uppercase tracking-[0.2em] text-editorial-dark-text/50 mb-3 lg:mb-4 flex items-center gap-2">
					<span className="inline-block w-1.5 h-1.5 rounded-sm bg-tertiary" />
					Latest Entries
				</p>
				<h1 className="font-headline font-extrabold text-4xl lg:text-7xl xl:text-8xl text-editorial-dark-text leading-[1.02] tracking-[-0.03em] mb-3 lg:mb-5 max-w-3xl">
					<span className="hidden lg:inline">
						The Analog
						<br />
						Revival
					</span>
					<span className="lg:hidden">
						Film
						<br />
						Recipes
					</span>
				</h1>
				<p className="font-body text-editorial-dark-text/40 text-sm lg:text-base max-w-md leading-[1.7]">
					A curated feed of bespoke sensor profiles, meticulously
					tuned for contemporary Fuji hardware.
				</p>
			</div>
		</section>
	);
}
