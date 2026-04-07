import { useState } from "react";

interface HeroImageProps {
	src: string;
	alt: string;
	className?: string;
	aspectRatio?: string;
}

export function HeroImage({
	src,
	alt,
	className = "",
	aspectRatio = "3/2",
}: HeroImageProps) {
	const [failed, setFailed] = useState(false);

	if (failed) {
		return (
			<div
				className={`bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center ${className}`}
				style={{ aspectRatio }}
			>
				<span className="font-label text-xs uppercase tracking-widest text-on-surface-variant/40">
					No Preview
				</span>
			</div>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			loading="lazy"
			className={`object-cover ${className}`}
			style={{ aspectRatio }}
			onError={() => setFailed(true)}
		/>
	);
}
