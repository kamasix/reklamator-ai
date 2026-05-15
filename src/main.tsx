import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { initTheme } from "@/hooks/useTheme";
import "./index.css";

initTheme();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Element #root nie został znaleziony.");
}

createRoot(container).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
