import { useState } from "react";
import { usePhotoUrl } from "../../hooks/usePhotoUrl";

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
	const resolvedSrc = usePhotoUrl(src);
	const [failed, setFailed] = useState(false);

	if (!resolvedSrc || failed) {
		return (
			<div
				className={`bg-linear-to-br from-surface-container to-surface-container-high flex items-center justify-center ${className}`}
				style={{ aspectRatio }}
			>
				<span className="font-label text-xs uppercase tracking-widest text-on-surface-variant/40">
					{resolvedSrc === "" && !failed ? "Loading..." : "No Preview"}
				</span>
			</div>
		);
	}

	return (
		<img
			src={resolvedSrc}
			alt={alt}
			loading="lazy"
			className={`object-cover ${className}`}
			style={{ aspectRatio }}
			onError={() => setFailed(true)}
		/>
	);
}
