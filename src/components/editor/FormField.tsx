interface FormFieldProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	type?: "text" | "textarea";
	placeholder?: string;
}

export function FormField({
	label,
	value,
	onChange,
	error,
	type = "text",
	placeholder,
}: FormFieldProps) {
	const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

	return (
		<div className="py-3">
			<label
				htmlFor={id}
				className="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2"
			>
				{label}
			</label>
			{type === "textarea" ? (
				<textarea
					id={id}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					rows={3}
					className="w-full bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none font-body text-sm text-on-surface py-1.5 transition-colors resize-none"
				/>
			) : (
				<input
					id={id}
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="w-full bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none font-body text-sm text-on-surface py-1.5 transition-colors"
				/>
			)}
			{error && (
				<p className="font-label text-[10px] text-error mt-1">{error}</p>
			)}
		</div>
	);
}

interface FormSelectProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: string[];
	error?: string;
	placeholder?: string;
}

export function FormSelect({
	label,
	value,
	onChange,
	options,
	error,
	placeholder = "Select...",
}: FormSelectProps) {
	const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

	return (
		<div className="py-3">
			<label
				htmlFor={id}
				className="block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant mb-2"
			>
				{label}
			</label>
			<select
				id={id}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none font-body text-sm text-on-surface py-1.5 transition-colors cursor-pointer"
			>
				<option value="">{placeholder}</option>
				{options.map((opt) => (
					<option key={opt} value={opt}>
						{opt}
					</option>
				))}
			</select>
			{error && (
				<p className="font-label text-[10px] text-error mt-1">{error}</p>
			)}
		</div>
	);
}
