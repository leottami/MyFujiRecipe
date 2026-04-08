import { useCallback, useMemo, useRef, useState } from "react";
import type { Recipe, RecipeCreateInput } from "../data/types";

type FormFields = RecipeCreateInput;
type FormErrors = Partial<Record<keyof FormFields, string>>;

const EMPTY_FORM: FormFields = {
	name: "",
	url: "",
	sensor: "X-Trans IV",
	publishedDate: "",
	thumbnailUrl: "",
	photos: [],
	filmSimulation: "",
	dynamicRange: "",
	highlight: "",
	shadow: "",
	color: "",
	noiseReduction: "",
	sharpening: "",
	clarity: "",
	grainEffect: "",
	colorChromeEffect: "",
	colorChromeEffectBlue: "",
	whiteBalance: "",
	iso: "",
	exposureCompensation: "",
	extraSettings: {},
};

function recipeToForm(recipe: Recipe): FormFields {
	const { id: _, createdAt: _c, updatedAt: _u, ...fields } = recipe;
	return fields;
}

export function useRecipeForm(initial?: Recipe) {
	const initialFields = useMemo(
		() => (initial ? recipeToForm(initial) : EMPTY_FORM),
		[initial],
	);
	const [fields, setFields] = useState<FormFields>(initialFields);
	const [errors, setErrors] = useState<FormErrors>({});
	const initialRef = useRef(initialFields);

	const setField = useCallback(
		<K extends keyof FormFields>(key: K, value: FormFields[K]) => {
			setFields((prev) => ({ ...prev, [key]: value }));
			setErrors((prev) => {
				if (!prev[key]) return prev;
				const next = { ...prev };
				delete next[key];
				return next;
			});
		},
		[],
	);

	const validate = useCallback((): FormErrors => {
		const errs: FormErrors = {};
		if (!fields.name.trim()) errs.name = "Recipe name is required";
		if (!fields.filmSimulation) errs.filmSimulation = "Film simulation is required";
		setErrors(errs);
		return errs;
	}, [fields]);

	const isDirty = useMemo(
		() => JSON.stringify(fields) !== JSON.stringify(initialRef.current),
		[fields],
	);

	const reset = useCallback(() => {
		setFields(initialRef.current);
		setErrors({});
	}, []);

	return { fields, setField, errors, validate, isDirty, reset };
}
