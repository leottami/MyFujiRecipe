export function HeroSection() {
	return (
		<section className="mb-10 lg:mb-14">
			<p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-3 flex items-center gap-2">
				<span className="inline-block w-1.5 h-1.5 rounded-sm bg-tertiary" />
				Latest Entries
			</p>
			<h1 className="font-headline font-extrabold text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-on-surface leading-[1.05] tracking-tight mb-4 max-w-2xl">
				The Analog Revival:
				<br />
				Chromatic Calibration
			</h1>
			<p className="font-body text-on-surface-variant text-sm lg:text-base max-w-lg leading-relaxed">
				A curated technical feed of bespoke sensor profiles, meticulously tuned
				for contemporary Fuji hardware. Every recipe is a digital artifact of
				chemical heritage.
			</p>
		</section>
	);
}
