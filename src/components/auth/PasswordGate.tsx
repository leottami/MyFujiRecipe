import { useState, type ReactNode } from "react";
import {
	isAuthenticated,
	setAuthenticated,
	verifyPassword,
} from "../../data/auth";

interface PasswordGateProps {
	children: ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
	const [authed, setAuthed] = useState(isAuthenticated);
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [checking, setChecking] = useState(false);
	const [unlocking, setUnlocking] = useState(false);

	if (authed) return <>{children}</>;

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setChecking(true);
		setError(false);

		const valid = await verifyPassword(password);
		if (valid) {
			setUnlocking(true);
			setTimeout(() => {
				setAuthenticated(true);
				setAuthed(true);
			}, 600);
		} else {
			setError(true);
			setPassword("");
		}
		setChecking(false);
	}

	return (
		<div
			className={`fixed inset-0 bg-inverse-surface flex flex-col items-center justify-center z-[100] transition-opacity duration-500 ${
				unlocking ? "opacity-0" : "opacity-100"
			}`}
		>
			{/* Subtle vignette */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

			{/* Content */}
			<div className="relative w-full max-w-sm px-8">
				{/* Logo mark */}
				<div className="flex justify-center mb-12">
					<div className="w-px h-16 bg-inverse-on-surface/20" />
				</div>

				{/* Title */}
				<div className="text-center mb-12">
					<p className="font-label text-[9px] uppercase tracking-[0.3em] text-inverse-on-surface/30 mb-4">
						Film Simulation Archive
					</p>
					<h1 className="font-headline font-extrabold text-3xl md:text-4xl uppercase tracking-[0.15em] text-inverse-on-surface/90 leading-tight">
						Tactile
						<br />
						Archive
					</h1>
				</div>

				{/* Divider */}
				<div className="flex items-center gap-4 mb-10">
					<div className="flex-1 h-px bg-inverse-on-surface/10" />
					<span className="font-label text-[8px] uppercase tracking-[0.3em] text-inverse-on-surface/25">
						179 Recipes
					</span>
					<div className="flex-1 h-px bg-inverse-on-surface/10" />
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="gate-password"
							className="block font-label text-[9px] uppercase tracking-[0.2em] text-inverse-on-surface/40 mb-3"
						>
							Access Code
						</label>
						<input
							id="gate-password"
							type="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setError(false);
							}}
							autoFocus
							className={`w-full bg-transparent border-b border-inverse-on-surface/20 focus:border-inverse-on-surface/60 outline-none font-body text-lg text-inverse-on-surface/80 py-3 tracking-[0.5em] text-center transition-all duration-300 placeholder:text-inverse-on-surface/15 placeholder:tracking-[0.2em] placeholder:text-sm ${
								error ? "border-error/60 animate-[shake_0.3s_ease-in-out]" : ""
							}`}
							placeholder="..."
						/>
					</div>

					{error && (
						<p className="font-label text-[9px] uppercase tracking-[0.15em] text-error/70 text-center">
							Access denied
						</p>
					)}

					<button
						type="submit"
						disabled={checking || !password}
						className="w-full bg-inverse-on-surface/10 hover:bg-inverse-on-surface/15 text-inverse-on-surface/70 hover:text-inverse-on-surface font-label text-[9px] uppercase tracking-[0.2em] py-3.5 rounded-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
					>
						{checking ? "Verifying..." : "Enter"}
					</button>
				</form>

				{/* Bottom mark */}
				<div className="flex justify-center mt-16">
					<p className="font-label text-[8px] uppercase tracking-[0.3em] text-inverse-on-surface/15">
						Fuji X-Trans IV
					</p>
				</div>
			</div>
		</div>
	);
}
