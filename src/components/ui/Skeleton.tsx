function Shimmer({ className = "" }: { className?: string }) {
	return (
		<div
			className={`bg-surface-container animate-pulse rounded-sm ${className}`}
		/>
	);
}

export function SkeletonCard() {
	return (
		<div className="break-inside-avoid mb-5 lg:mb-0">
			<Shimmer className="w-full aspect-[3/2] mb-3" />
			<Shimmer className="h-4 w-3/4 mb-2" />
			<Shimmer className="h-3 w-1/2 mb-2" />
			<Shimmer className="h-3 w-2/3" />
		</div>
	);
}

export function SkeletonFeedGrid() {
	return (
		<>
			{/* Mobile */}
			<div className="columns-1 md:columns-2 gap-4 lg:hidden">
				{Array.from({ length: 6 }, (_, i) => (
					<div
						key={i}
						className="animate-fade-in-up"
						style={{ animationDelay: `${i * 80}ms` }}
					>
						<SkeletonCard />
					</div>
				))}
			</div>

			{/* Desktop */}
			<div className="hidden lg:grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-x-10 gap-y-6">
				{Array.from({ length: 8 }, (_, i) => (
					<div
						key={i}
						className={`animate-fade-in-up ${i % 2 === 1 ? "mt-16" : ""}`}
						style={{ animationDelay: `${i * 80}ms` }}
					>
						<SkeletonCard />
					</div>
				))}
			</div>
		</>
	);
}

export function SkeletonDetail() {
	return (
		<div className="max-w-[1100px] mx-auto px-4 lg:px-10 animate-fade-in-up">
			{/* Hero */}
			<Shimmer className="w-full aspect-[21/9] -mx-4 lg:mx-0 mb-8 rounded-sm" />

			<div className="lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-16">
				<div>
					<Shimmer className="h-3 w-24 mb-6" />
					<Shimmer className="h-10 w-3/4 mb-3" />
					<Shimmer className="h-3 w-32 mb-6" />
					<Shimmer className="h-20 w-full max-w-lg mb-8" />
					<div className="flex gap-3 mb-10">
						<Shimmer className="h-9 w-28" />
						<Shimmer className="h-9 w-24" />
					</div>
				</div>
				<div>
					<Shimmer className="h-3 w-40 mb-6" />
					<Shimmer className="h-48 w-full mb-6" />
					<Shimmer className="h-48 w-full mb-6" />
					<Shimmer className="h-36 w-full" />
				</div>
			</div>
		</div>
	);
}
