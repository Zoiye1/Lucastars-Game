import { RootComponent } from "./components/RootComponent";
import { NotFoundComponent } from "./components/NotFoundComponent";
import { CanvasComponent } from "./components/CanvasComponent";

// Expose the web components to the browser
window.customElements.define("game-root", RootComponent);
window.customElements.define("game-notfound", NotFoundComponent);
window.customElements.define("game-canvas", CanvasComponent);
