import { useEffect, useState } from "react";
import { isIdbUrl, resolvePhotoUrl, revokePhotoUrl } from "../data/photoResolver";

export function usePhotoUrl(url: string): string {
	const [resolved, setResolved] = useState(() => (isIdbUrl(url) ? "" : url));

	useEffect(() => {
		if (!isIdbUrl(url)) {
			setResolved(url);
			return;
		}

		let cancelled = false;
		resolvePhotoUrl(url).then((objectUrl) => {
			if (!cancelled) setResolved(objectUrl);
		});

		return () => {
			cancelled = true;
			revokePhotoUrl(url);
		};
	}, [url]);

	return resolved;
}
