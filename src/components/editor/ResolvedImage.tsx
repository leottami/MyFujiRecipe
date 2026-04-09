import { usePhotoUrl } from "../../hooks/usePhotoUrl";
import { HeroImage } from "../recipe/HeroImage";

interface ResolvedImageProps {
	src: string;
	alt: string;
	className?: string;
	aspectRatio?: string;
}

export function ResolvedImage({ src, alt, className, aspectRatio }: ResolvedImageProps) {
	const resolvedUrl = usePhotoUrl(src);

	if (!resolvedUrl) {
		return (
			<div
				className={`bg-linear-to-br from-surface-container to-surface-container-high flex items-center justify-center ${className ?? ""}`}
				style={{ aspectRatio }}
			>
				<span className="font-label text-xs uppercase tracking-widest text-on-surface-variant/40 animate-pulse">
					Loading...
				</span>
			</div>
		);
	}

	return (
		<HeroImage
			src={resolvedUrl}
			alt={alt}
			className={className}
			aspectRatio={aspectRatio}
		/>
	);
}
