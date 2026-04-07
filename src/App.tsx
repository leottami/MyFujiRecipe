import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { FeedPage } from "./pages/FeedPage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";

export function App() {
	return (
		<AppShell>
			<Routes>
				<Route path="/" element={<FeedPage />} />
				<Route path="/recipe/:id" element={<RecipeDetailPage />} />
			</Routes>
		</AppShell>
	);
}
