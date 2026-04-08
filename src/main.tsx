import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import { RecipeProvider, StaticJsonRepository } from "./data/repository";
import "./app.css";

const repository = new StaticJsonRepository();

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
	<StrictMode>
		<HashRouter>
			<RecipeProvider repository={repository}>
				<App />
			</RecipeProvider>
		</HashRouter>
	</StrictMode>,
);
