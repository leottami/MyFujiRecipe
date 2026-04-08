import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { FeedPage } from "./pages/FeedPage";
import { PhotographerProfilePage } from "./pages/PhotographerProfilePage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { RecipeEditorPage } from "./pages/RecipeEditorPage";

export function App() {
	return (
		<AppShell>
			<Routes>
				<Route path="/" element={<FeedPage />} />
				<Route path="/recipe/new" element={<RecipeEditorPage />} />
				<Route path="/recipe/:id/edit" element={<RecipeEditorPage />} />
				<Route path="/recipe/:id" element={<RecipeDetailPage />} />
				<Route path="/photographer/:authorId" element={<PhotographerProfilePage />} />
			</Routes>
		</AppShell>
	);
}
