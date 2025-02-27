import { RootComponent } from "./components/RootComponent";
import { NotFoundComponent } from "./components/NotFoundComponent";
import { CanvasComponent } from "./components/CanvasComponent";
// import { ArrowComponent } from "./components/ArrowComponent";

// Expose the web components to the browser
window.customElements.define("game-root", RootComponent);
window.customElements.define("game-notfound", NotFoundComponent);
window.customElements.define("game-canvas", CanvasComponent);
// window.customElements.define("game-arrow", ArrowComponent);
