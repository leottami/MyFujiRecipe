import { Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { FeedPage } from "./pages/FeedPage";
import { PhotographerProfilePage } from "./pages/PhotographerProfilePage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { RecipeEditorPage } from "./pages/RecipeEditorPage";

export function App() {
	const location = useLocation();

	return (
		<AppShell>
			<div key={location.pathname} className="animate-page-enter">
				<Routes location={location}>
					<Route path="/" element={<FeedPage />} />
					<Route path="/recipe/new" element={<RecipeEditorPage />} />
					<Route path="/recipe/:id/edit" element={<RecipeEditorPage />} />
					<Route path="/recipe/:id" element={<RecipeDetailPage />} />
					<Route path="/photographer/:authorId" element={<PhotographerProfilePage />} />
					<Route path="/profile" element={<ProfilePage />} />
				</Routes>
			</div>
		</AppShell>
	);
}
