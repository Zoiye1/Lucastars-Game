import { css, htmlArray } from "../helpers/webComponents";
import { GameRouteService } from "../services/GameRouteService";
import { GameState } from "@shared/types";
import { Page } from "../enums/Page";
import { GameEventService } from "../services/GameEventService";

/**
 * CSS styles for the simplified map component
 */
const styles: string = css`
    :host {
        display: block;
    }

    .map-button {
        position: absolute;
        top: 25%;
        right: 0%;
        z-index: 1;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        width: 50px;
        height: 50px;
        z-index: 1;
    } 

    .map-button:hover{
        filter: brightness(0.5);
        scale: 1.1;
    }

    .map-button img {
        width: 200%;
        height: 200%;
        object-fit: contain;
    }

    .map-panel {
        display: none;
        background-color: rgba(20, 20, 20, 0.95);
        border: 2px solid #9f3f16;
        border-radius: 8px;
        padding: 15px;
        color: white;
        max-height: 550px;
        overflow-y: auto;
        position: absolute;
        top: 0%;
        left: 50%;
        transform: translateX(-55%);
        z-index: 3;
    }

    .map-panel.active {
        display: block;
    }

    .container-map {
        max-width: 800px;
        margin: 0 auto;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        top: 6%;
        left: 50%;
    }

    .dashed-divider {
        border-top: 2px dashed #9f3f16;
        margin: 10px 0;
    }

    #closeMap {
        font-family: "Onesize", sans-serif;
        background-color: transparent;
        padding: 0 5px;
        position: absolute;
        top: 10px;
        right: 10px;
        border: 1px solid #9f3f16;
        border-radius: 5px;
        font-size: 24px;
        cursor: pointer;
        color: #9f3f16;
        transition: all 0.3s ease;
    }

    #closeMap:hover {
        background-color: #9f3f16;
        color: white;
    }

    .map-title {
        color: #9f3f16;
        text-align: center;
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: bold;
    }

    .map-container {
        position: relative;
        width: 100%;
        height: 400px;
        background-color: rgba(0, 0, 0, 0.3);
        border: 2px solid #9f3f16;
        border-radius: 8px;
        overflow: auto;
    }

    .map-inner {
        position: relative;
        width: 650px;
        height: 380px;
        margin: 10px auto;
    }

    .room {
        position: absolute;
        background-color: #9f3f16;
        color: white;
        padding: 8px;
        border-radius: 5px;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        user-select: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .current-room {
        background-color: #ff5252;
        outline: 3px solid rgba(255, 82, 82, 0.8);
        box-shadow: 0 0 10px rgba(255, 82, 82, 0.8);
    }

    /* Arrow styles */
    .arrow {
        position: absolute;
        background-color: #666;
        pointer-events: none;
    }

    .arrow-horizontal {
        height: 2px;
    }

    .arrow-vertical {
        width: 2px;
    }

    .arrow-diagonal {
        height: 2px;
        transform-origin: 0 0;
    }

    .arrow-head {
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
    }

    .arrow-head-right {
        border-width: 5px 0 5px 8px;
        border-color: transparent transparent transparent #666;
        margin-top: -4px;
    }

    .arrow-head-down {
        border-width: 8px 5px 0 5px;
        border-color: #666 transparent transparent transparent;
        margin-left: -4px;
    }

    .arrow-head-up {
        border-width: 0 5px 8px 5px;
        border-color: transparent transparent #666 transparent;
        margin-left: -4px;
    }

    .arrow-head-diagonal {
        border-width: 5px 0 5px 8px;
        border-color: transparent transparent transparent #666;
        margin-left: -4px;
    }

    .curved-arrow {
        position: absolute;
        stroke: #666;
        stroke-width: 2px;
        fill: none;
    }

    .map-legend {
        margin-top: 10px;
        padding: 10px;
        background-color: rgba(51, 44, 87, 0.5);
        border-radius: 5px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        color: white;
    }

    .legend-marker {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .legend-marker.current {
        background-color: #ff5252;
        border: 1px solid white;
    }

    /* Room positioning */
    #startRoom {
        top: 120px;
        left: 220px;
        width: 100px;
        height: 50px;
    }

    #vent {
        top: 40px;
        left: 240px;
        width: 60px;
        height: 30px;
    }

    #roof {
        top: 40px;
        left: 370px;
        width: 100px;
        height: 50px;
    }

    #hallway {
        top: 120px;
        left: 80px;
        width: 40px;
        height: 120px;
        writing-mode: vertical-lr;
        transform: rotate(180deg);
    }

    #toilet {
        top: 200px;
        left: 220px;
        width: 90px;
        height: 30px;
    }

    #strangerRoom {
        top: 30px;
        left: 60px;
        width: 100px;
        height: 50px;
    }

    #cafeteria {
        top: 270px;
        left: 220px;
        width: 100px;
        height: 50px;
    }

    #courtyard {
        top: 340px;
        left: 60px;
        width: 100px;
        height: 40px;
    }

    #kitchen {
        top: 270px;
        left: 520px;
        width: 100px;
        height: 50px;
    }

    #gym {
        top: 340px;
        left: 380px;
        width: 100px;
        height: 40px;
    }

    #lab {
        top: 40px;
        left: 520px;
        width: 100px;
        height: 50px;
    }

    #storage {
        top: 140px;
        left: 520px;
        width: 100px;
        height: 40px;
    }
`;

/**
 * Simplified Map Component that only tracks current room
 */
export class MapComponent extends HTMLElement {
    /** Instance of the game event service */
    private readonly _gameEventService: GameEventService = new GameEventService();
    /**
     * The game route service
     */
    private readonly _gameRouteService: GameRouteService = new GameRouteService();

    /**
     * Whether the map panel is open
     */
    private _isPanelOpen: boolean = false;

    /**
     * Current room alias
     */
    private _currentRoom: string = "";

    /**
     * Callback for when the web component is connected to the DOM
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Listen for state updates from player session
        this.addEventListener("state-update", () => {
            void this.refreshGameState();
        });

        // Initialize map with current game state
        void this.refreshGameState();
        this.render();
    }

    /**
     * Callback for when the web component is disconnected from the DOM
     */
    public disconnectedCallback(): void {
        // Remove event listener to prevent memory leaks
        this.removeEventListener("state-update", () => {
            void this.refreshGameState();
        });
    }

    /**
     * Refresh the current game state
     */
    private async refreshGameState(): Promise<void> {
        try {
            const state: GameState = await this._gameRouteService.getGameState();
            this.updateGameState(state);
        }
        catch (error) {
            console.error("Error getting game state:", error);
        }
    }

    /**
     * Update the game state in the component
     *
     * @param state Game state to update the component with
     */
    private updateGameState(state: GameState): void {
        // Handle switching pages, if requested.
        if (state.type === "switch-page") {
            this._gameEventService.switchPage(state.page as Page);
            return;
        }

        if (state.roomAlias) {
            // Update current room
            this._currentRoom = state.roomAlias;

            // Log the current room to debug
            console.log("Current room from game state:", state.roomAlias);

            // Re-render to reflect state changes
            this.render();
        }
    }

    /**
     * Get location status class
     */
    private getLocationClass(locationId: string): string {
        let classes: string = "room";

        // Check for exact match first
        if (locationId === this._currentRoom) {
            classes += " current-room";
        }
        // Also check for case insensitive matching (e.g., "startroom" vs "startRoom")
        else if (locationId.toLowerCase() === this._currentRoom.toLowerCase()) {
            classes += " current-room";
        }
        // Check if room alias contains the ID (e.g., "start_room" might contain "start")
        else if (this._currentRoom.toLowerCase().includes(locationId.toLowerCase()) ||
          locationId.toLowerCase().includes(this._currentRoom.toLowerCase())) {
            console.log(`Partial match: Room ID ${locationId} matched with current room ${this._currentRoom}`);
            classes += " current-room";
        }

        return classes;
    }

    /**
     * Render the component
     */
    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const elements: HTMLElement[] = htmlArray`
            <style>${styles}</style>
            <button class="map-button">
                <img src="/assets/img/MapButton.png" alt="crafting">
            </button>
            <div class="map-panel ${this._isPanelOpen ? "active" : ""}">
                <div class="container-map">
                    <button id="closeMap">X</button>
                    <div class="dashed-divider"></div>
                    <h2 class="map-title">Hospital Map</h2>
                    <div class="map-container">
                        <div class="map-inner">
                            <!-- Rooms with dynamic classes based on game state -->
                            <div class="${this.getLocationClass("starterroom")}" id="startRoom" title="Start Room">Start Room</div>
                            <div class="${this.getLocationClass("vent")}" id="vent" title="Vent">Vent</div>
                            <div class="${this.getLocationClass("roof")}" id="roof" title="Roof">Roof</div>
                            <div class="${this.getLocationClass("hallway")}" id="hallway" title="Hallway">Hallway</div>
                            <div class="${this.getLocationClass("toilet")}" id="toilet" title="Toilet">Toilet</div>
                            <div class="${this.getLocationClass("strangerRoom")}" id="strangerRoom" title="Stranger Room">Stranger Room</div>
                            <div class="${this.getLocationClass("cafeteria")}" id="cafeteria" title="Cafeteria">Cafeteria</div>
                            <div class="${this.getLocationClass("courtyard")}" id="courtyard" title="Courtyard">Courtyard</div>
                            <div class="${this.getLocationClass("kitchen")}" id="kitchen" title="Kitchen">Kitchen</div>
                            <div class="${this.getLocationClass("gym")}" id="gym" title="Gym">Gym</div>
                            <div class="${this.getLocationClass("lab")}" id="lab" title="Lab">Lab</div>
                            <div class="${this.getLocationClass("storage")}" id="storage" title="Storage">Storage</div>
                            
                            <!-- Stramger Room to Vent -->
                            <div class="arrow arrow-horizontal" style="top: 55px; left: 160px; width: 60px;"></div>
                            <div class="arrow-head arrow-head-right" style="left: 220px; top: 55px;"></div>
                            
                            <!-- Vent to Roof -->
                            <div class="arrow arrow-horizontal" style="top: 55px; left: 320px; width: 40px;"></div>
                            <div class="arrow-head arrow-head-right" style="left: 360px; top: 55px;"></div>
                            
                            <!-- Strangerroom to Hallway -->
                            <div class="arrow arrow-vertical" style="top: 90px; left: 100px; height: 30px;"></div>
                            <div class="arrow-head arrow-head-down" style="left: 100px; top: 120px;"></div>

                            <!-- Vent to Startroom -->
                            <div class="arrow arrow-vertical" style="top: 90px; left: 270px; height: 30px;"></div>
                            <div class="arrow-head arrow-head-down" style="left: 270px; top: 120px;"></div>
                            
                            <!-- Hallway to StarterRoom -->
                            <div class="arrow arrow-horizontal" style="top: 160px; left: 140px; width: 70px;"></div>
                            <div class="arrow-head arrow-head-right" style="left: 210px; top: 160px;"></div>

                            <!-- Hallway to Toilet -->
                            <div class="arrow arrow-horizontal" style="top: 220px; left: 140px; width: 70px;"></div>
                            <div class="arrow-head arrow-head-right" style="left: 210px; top: 220px;"></div>
                            
                            
                            <!-- Hallway to Cafeteria -->
                            <div class="arrow arrow-diagonal" style="top: 260px; left: 140px; width: 80px; transform: rotate(35deg);"></div>
                            <div class="arrow-head arrow-head-diagonal" style="left: 202px; top: 300px; transform: rotate(35deg);"></div>

                            <!-- Cafeteria to gym -->
                            <div class="arrow arrow-diagonal" style="top: 340px; left: 350px; width: 20px; transform: rotate(35deg);"></div>
                            <div class="arrow-head arrow-head-diagonal" style="left: 370px; top: 350px; transform: rotate(35deg);"></div>

                            <!-- Cafeteria to Courtyard -->
                            <div class="arrow arrow-diagonal" style="top: 340px; left: 210px; width: 20px; transform: rotate(135deg);"></div>
                            <div class="arrow-head arrow-head-diagonal" style="left: 195px; top: 350px; transform: rotate(135deg);"></div>
                            
                            <!-- Cafeteria to Kitchen -->
                            <div class="arrow arrow-horizontal" style="top: 295px; left: 350px; width: 140px;"></div>
                            <div class="arrow-head arrow-head-right" style="left: 490px; top: 295px;"></div>
                            
                            <!-- Storage to Lab -->
                            <div class="arrow arrow-vertical" style="top: 90px; left: 570px; height: 50px;"></div>
                            <div class="arrow-head arrow-head-up" style="left: 570px; top: 90px;"></div>
                            
                            <!-- Kitchen to Storage -->
                            <div class="arrow arrow-vertical" style="top: 200px; left: 570px; height: 70px;"></div>
                            <div class="arrow-head arrow-head-up" style="left: 570px; top: 200px;"></div>
                        </div>
                    </div>
                    
                    <div class="map-legend">
                        <div class="legend-item">
                            <div class="legend-marker current"></div>
                            <span>Current Location</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Clear the shadow root
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }

        // Add the new elements
        this.shadowRoot.append(...elements);

        // Add event listener for the map button
        const mapButton: HTMLElement | null = this.shadowRoot.querySelector(".map-button");
        if (mapButton) {
            mapButton.addEventListener("click", () => {
                this._isPanelOpen = !this._isPanelOpen;
                this.render();
            });
        }

        const closeBtn: HTMLButtonElement = this.shadowRoot.querySelector("#closeMap") as HTMLButtonElement;

        closeBtn.addEventListener("click", () => {
            this._isPanelOpen = !this._isPanelOpen;
            this.render();
        });
    }
}
