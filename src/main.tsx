import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element with id 'root' not found. Ensure index.html contains <div id=\"root\"></div>."
  );
}

createRoot(rootElement).render(<App />);
