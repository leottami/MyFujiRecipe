import { afterEach, describe, expect, it } from "vitest";
import { isAuthenticated, setAuthenticated, verifyPassword } from "../auth";

describe("verifyPassword", () => {
	it("returns true for correct password", async () => {
		expect(await verifyPassword("fuji2024")).toBe(true);
	});

	it("returns false for wrong password", async () => {
		expect(await verifyPassword("wrong")).toBe(false);
		expect(await verifyPassword("")).toBe(false);
		expect(await verifyPassword("fuji2025")).toBe(false);
	});
});

describe("isAuthenticated / setAuthenticated", () => {
	afterEach(() => {
		localStorage.clear();
	});

	it("returns false by default", () => {
		expect(isAuthenticated()).toBe(false);
	});

	it("returns true after setting authenticated", () => {
		setAuthenticated(true);
		expect(isAuthenticated()).toBe(true);
	});

	it("returns false after clearing authentication", () => {
		setAuthenticated(true);
		setAuthenticated(false);
		expect(isAuthenticated()).toBe(false);
	});
});
