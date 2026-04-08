const PASSWORD_HASH =
	"50b3da0c9c910bb6bf96a7b951c9004bc5eed56d5a9b738dd89949b523b48ef7";
const AUTH_KEY = "iamfuji_auth";

export async function verifyPassword(input: string): Promise<boolean> {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	return hashHex === PASSWORD_HASH;
}

export function isAuthenticated(): boolean {
	return localStorage.getItem(AUTH_KEY) === "true";
}

export function setAuthenticated(value: boolean): void {
	if (value) {
		localStorage.setItem(AUTH_KEY, "true");
	} else {
		localStorage.removeItem(AUTH_KEY);
	}
}
