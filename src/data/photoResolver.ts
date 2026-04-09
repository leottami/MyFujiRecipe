import { getPhoto } from "./photoStore";

const IDB_PREFIX = "idb://";
const urlCache = new Map<string, string>();
const MAX_CACHE = 20;

export function isIdbUrl(url: string): boolean {
	return url.startsWith(IDB_PREFIX);
}

function evictOldest(): void {
	if (urlCache.size < MAX_CACHE) return;
	const firstKey = urlCache.keys().next().value;
	if (firstKey) {
		const objectUrl = urlCache.get(firstKey);
		if (objectUrl) URL.revokeObjectURL(objectUrl);
		urlCache.delete(firstKey);
	}
}

export async function resolvePhotoUrl(url: string): Promise<string> {
	if (!isIdbUrl(url)) return url;

	const cached = urlCache.get(url);
	if (cached) return cached;

	const id = url.slice(IDB_PREFIX.length);
	const stored = await getPhoto(id);
	if (!stored) return "";

	evictOldest();
	const objectUrl = URL.createObjectURL(stored.blob);
	urlCache.set(url, objectUrl);
	return objectUrl;
}

export function revokePhotoUrl(url: string): void {
	const cached = urlCache.get(url);
	if (cached) {
		URL.revokeObjectURL(cached);
		urlCache.delete(url);
	}
}

export function revokeAllPhotoUrls(): void {
	for (const objectUrl of urlCache.values()) {
		URL.revokeObjectURL(objectUrl);
	}
	urlCache.clear();
}
