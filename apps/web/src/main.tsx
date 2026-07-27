import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { createAppRouter } from "./routing/adapters/react-router/create-app-router";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element was not found.");
}

// The router adapter is chosen here and nowhere else. Swapping routers means
// replacing these two lines and the adapter directory they point at.
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={createAppRouter()} />
  </StrictMode>,
);
