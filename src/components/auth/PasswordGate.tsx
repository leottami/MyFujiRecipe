import { useState, type ReactNode } from "react";
import { isAuthenticated, setAuthenticated, verifyPassword } from "../../data/auth";

interface PasswordGateProps {
	children: ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
	const [authed, setAuthed] = useState(isAuthenticated);
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [checking, setChecking] = useState(false);

	if (authed) return <>{children}</>;

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setChecking(true);
		setError(false);

		const valid = await verifyPassword(password);
		if (valid) {
			setAuthenticated(true);
			setAuthed(true);
		} else {
			setError(true);
			setPassword("");
		}
		setChecking(false);
	}

	return (
		<div className="fixed inset-0 bg-surface flex items-center justify-center z-[100]">
			<div className="w-full max-w-xs px-6">
				<div className="text-center mb-10">
					<h1 className="font-headline font-extrabold text-2xl uppercase tracking-[0.2em] text-on-surface mb-2">
						Tactile Archive
					</h1>
					<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60">
						Fuji Recipe Collection
					</p>
				</div>

				<form onSubmit={handleSubmit}>
					<label
						htmlFor="gate-password"
						className="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2"
					>
						Access Code
					</label>
					<input
						id="gate-password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter password"
						autoFocus
						className="w-full bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none font-body text-sm text-on-surface py-2 mb-4 transition-colors"
					/>

					{error && (
						<p className="font-label text-[10px] text-error mb-4">
							Invalid access code
						</p>
					)}

					<button
						type="submit"
						disabled={checking || !password}
						className="w-full bg-inverse-surface text-inverse-on-surface font-label text-[10px] uppercase tracking-[0.15em] py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
					>
						{checking ? "Verifying..." : "Enter Archive"}
					</button>
				</form>
			</div>
		</div>
	);
}
