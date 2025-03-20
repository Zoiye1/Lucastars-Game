import { Arrowroom, DefaultGameState, GameObjectReference, GameState } from "@shared/types";
import { css } from "../helpers/webComponents";
import { GameEventService } from "../services/GameEventService";
import { GameRouteService } from "../services/GameRouteService";
import { htmlArray } from "../helpers/webComponents";
import { Page } from "../enums/Page";

const styles: string = css`
    .arrow {
        width: auto;
        height: 100%;
        image-rendering: pixelated;
        position: absolute;
    }
    
    .arrow:hover {
      filter: hue-rotate(90deg) brightness(1.5);
    }

    .locationText {
        position: absolute;
        bottom: 5%;
        color:rgb(81, 255, 81);
        text-shadow: 
    -2px -2px 0 #000,  
     2px -2px 0 #000,  
    -2px  2px 0 #000,  
     2px  2px 0 #000;
    }

`;

export class ClickInteractableComponent extends HTMLElement {
    /** Instance of the game event service */
    private readonly _gameEventService: GameEventService = new GameEventService();
    /** Instance of the game route service */
    private readonly _gameRouteService: GameRouteService = new GameRouteService();

    /** Current game state */
    private _currentGameState?: DefaultGameState;
    /** Current active game object buttons */
    private _selectedGameObjectButtons: Set<GameObjectReference> = new Set<GameObjectReference>();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.refreshGameState();
    }

    /**
         * Refresh the current game state
         */
    private async refreshGameState(): Promise<void> {
        const state: GameState = await this._gameRouteService.getGameState();

        this.updateGameState(state);
    }

    /**
         * Update the canvas to the provided game state
         *
         * @param state Game state to update the canvas to
         */
    private updateGameState(state: GameState): void {
        // Handle switching pages, if requested.
        if (state.type === "switch-page") {
            this._gameEventService.switchPage(state.page as Page);

            return;
        }

        // Reset the component
        this._currentGameState = state;

        this._selectedGameObjectButtons.clear();

        // Refresh the web component
        this.render();
    }

    private Connect(state: GameState): void {
        this.dispatchEvent(new CustomEvent("state-update", {
            detail: state,
            bubbles: true, // <-- makes the event travel up DOM so canvas can hear it
            composed: true,
        }));
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }
        const locationText: HTMLParagraphElement = document.createElement("p");
        locationText.classList.add("locationText");
        locationText.textContent = "";
        const element: HTMLElement[] = htmlArray`
            <style>
                ${styles}
            </style>
                ${this.renderArrow()}
                ${locationText}
            `;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }

        this.shadowRoot.append(...element);
    }
}
