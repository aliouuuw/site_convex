import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import ContentProvider from "./components/ContentProvider";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ConvexAuthProvider client={convex}>
        <ContentProvider>
          <App />
        </ContentProvider>
      </ConvexAuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
