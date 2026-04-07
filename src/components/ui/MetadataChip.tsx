interface MetadataChipProps {
	label: string;
	value?: string;
}

export function MetadataChip({ label, value }: MetadataChipProps) {
	return (
		<span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-md font-label text-sm">
			{value ? `${label}: ${value}` : label}
		</span>
	);
}
