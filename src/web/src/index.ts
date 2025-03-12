import { RootComponent } from "./components/RootComponent";
import { NotFoundComponent } from "./components/NotFoundComponent";
import { CanvasComponent } from "./components/CanvasComponent";
import { ArrowComponent } from "./components/ArrowComponent";
import { CraftingComponent } from "./components/CraftingComponent";
import { QuestComponent } from "./components/QuestComponent";
import { MapComponent } from "./components/MapComponent";
// import { ArrowComponent } from "./components/ArrowComponent";

// Expose the web components to the browser
window.customElements.define("game-root", RootComponent);
window.customElements.define("game-notfound", NotFoundComponent);
window.customElements.define("game-canvas", CanvasComponent);
window.customElements.define("game-arrow", ArrowComponent);
// window.customElements.define("game-arrow", ArrowComponent);
window.customElements.define("game-crafting", CraftingComponent);
window.customElements.define("game-quest", QuestComponent);
window.customElements.define("game-map", MapComponent);
