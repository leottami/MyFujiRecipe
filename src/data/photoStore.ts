const DB_NAME = "iamfuji";
const DB_VERSION = 1;
const STORE_NAME = "photos";

export interface StoredPhoto {
	id: string;
	blob: Blob;
	mimeType: string;
	width: number;
	height: number;
	sizeBytes: number;
	createdAt: string;
}

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "id" });
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function savePhoto(photo: StoredPhoto): Promise<void> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readwrite");
		tx.objectStore(STORE_NAME).put(photo);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

export async function getPhoto(id: string): Promise<StoredPhoto | undefined> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readonly");
		const request = tx.objectStore(STORE_NAME).get(id);
		request.onsuccess = () => resolve(request.result as StoredPhoto | undefined);
		request.onerror = () => reject(request.error);
	});
}

export async function deletePhoto(id: string): Promise<void> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readwrite");
		tx.objectStore(STORE_NAME).delete(id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

export async function getStorageUsage(): Promise<{ count: number; totalBytes: number }> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readonly");
		const store = tx.objectStore(STORE_NAME);
		const request = store.getAll();
		request.onsuccess = () => {
			const photos = request.result as StoredPhoto[];
			resolve({
				count: photos.length,
				totalBytes: photos.reduce((sum, p) => sum + p.sizeBytes, 0),
			});
		};
		request.onerror = () => reject(request.error);
	});
}
