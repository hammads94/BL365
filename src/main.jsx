import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AppKitProvider } from "./context/AppkitContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppKitProvider>
      <Toaster />
      <App />
    </AppKitProvider>
  </StrictMode>
);
