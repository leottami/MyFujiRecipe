import { useState } from "react";
import { ALL_TAGS } from "../../data/filterHelpers";

interface TagEditorProps {
	tags: string[];
	onChange: (tags: string[]) => void;
}

export function TagEditor({ tags, onChange }: TagEditorProps) {
	const [showAdd, setShowAdd] = useState(false);
	const [custom, setCustom] = useState("");

	const availableTags = ALL_TAGS.filter((t) => !tags.includes(t));

	function addTag(tag: string) {
		if (!tags.includes(tag)) {
			onChange([...tags, tag]);
		}
		setShowAdd(false);
		setCustom("");
	}

	function removeTag(tag: string) {
		onChange(tags.filter((t) => t !== tag));
	}

	function addCustom() {
		const trimmed = custom.trim();
		if (!trimmed || trimmed.length > 30 || tags.includes(trimmed)) return;
		if (!/^[a-z0-9\s\-&]+$/i.test(trimmed)) return;
		onChange([...tags, trimmed]);
		setCustom("");
		setShowAdd(false);
	}

	return (
		<div className="flex flex-wrap items-center gap-1.5">
			{tags.map((tag) => (
				<span
					key={tag}
					className="inline-flex items-center gap-1 bg-tertiary/10 text-tertiary font-label text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm"
				>
					{tag}
					<button
						type="button"
						onClick={() => removeTag(tag)}
						className="text-tertiary/60 hover:text-tertiary transition-colors"
					>
						&times;
					</button>
				</span>
			))}

			{!showAdd ? (
				<button
					type="button"
					onClick={() => setShowAdd(true)}
					className="inline-flex items-center gap-1 text-on-surface-variant/60 hover:text-on-surface font-label text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-sm hover:bg-surface-container transition-colors"
				>
					+ Tag
				</button>
			) : (
				<div className="flex flex-col gap-2 w-full mt-2">
					{/* Preset tags */}
					{availableTags.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{availableTags.map((tag) => (
								<button
									type="button"
									key={tag}
									onClick={() => addTag(tag)}
									className="px-2.5 py-1 font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-sm transition-colors"
								>
									{tag}
								</button>
							))}
						</div>
					)}

					{/* Custom tag input */}
					<div className="flex gap-2">
						<input
							type="text"
							value={custom}
							onChange={(e) => setCustom(e.target.value)}
							onKeyDown={(e) =>
								e.key === "Enter" && (e.preventDefault(), addCustom())
							}
							placeholder="Custom tag..."
							className="flex-1 bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none font-body text-sm text-on-surface py-1 transition-colors"
						/>
						<button
							type="button"
							onClick={addCustom}
							className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-on-surface transition-colors px-2"
						>
							Add
						</button>
						<button
							type="button"
							onClick={() => {
								setShowAdd(false);
								setCustom("");
							}}
							className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 hover:text-on-surface transition-colors px-2"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
