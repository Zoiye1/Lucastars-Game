import { ActionReference, ClickItem, DefaultGameState, GameObjectReference, GameState } from "@shared/types";
import { css, html } from "../helpers/webComponents";
import { GameEventService } from "../services/GameEventService";
import { GameRouteService } from "../services/GameRouteService";
import { htmlArray } from "../helpers/webComponents";
import { Page } from "../enums/Page";

const styles: string = css`
    .Item {
        width: auto;
        height: 50%;
        image-rendering: pixelated;
        position: absolute;
        
    }
    
    .Item:hover {
      filter: brightness(0.4);
    }

    .Item.active {
        width: auto;
        height: 50%;
        image-rendering: pixelated;
        position: absolute;
         filter: drop-shadow(0 0 8px rgb(255, 196, 0)); 
    }

    .buttons {
        z-index: 3;
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding: 5px 5px 5px 5px;
        background:rgb(66, 51, 142);
        position: absolute;
        visibility: hidden;
    }

    .buttons.active {
        z-index: 3;
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding: 5px 5px 5px 5px;
        background:rgb(66, 51, 142);
        position: absolute;
        visibility: visible;
    }

    .button {
        z-index: 3;
        background-color: #7f6ed7;
        border: 1px solid #332c57;
        padding: 3px 0px;
        margin: 0 0 0px 0px;
        text-transform: uppercase;
        cursor: pointer;
        display: inline-block;
        user-select: none;
    }

    .button.active,
    .button:hover {
        background-color: #332c57;
    }
    .TitleItem {
    position: absolute;
    color: rgb(255, 196, 0);
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
        console.log(state);
        this.dispatchEvent(new CustomEvent("state-update-click", {
            detail: state, // gamestate has to be send
            bubbles: true,
            composed: true,
        }));
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement[] = htmlArray`
            <style>
                ${styles}
            </style>
            ${this.renderInteractables()}
            `;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }

        this.shadowRoot.append(...element);
    }

    private renderInteractables(): HTMLElement[] | undefined {
        const roomImages: ClickItem[] | undefined = this._currentGameState?.roomClickImages;
        if (roomImages && roomImages.length > 0) {
            return roomImages.map(item => this.createItemElement(item));
        }

        return htmlArray``;
    }

    private createItemElement(item: ClickItem): HTMLElement {
        const container: HTMLElement = document.createElement("div");
        const img: HTMLImageElement = document.createElement("img");

        img.classList.add("Item");
        img.style.left = `${item.imageCoords.x}%`;
        img.style.top = `${item.imageCoords.y}%`;
        img.src = `/assets/img/rooms/${item.imageUrl}.png`;
        // Makes width and height depended on the amount of pixels and halfs it
        // This makes sure pixel art is consitent when we use the agreed upon format of 1280 X 640
        img.onload = () => {
            img.style.width = `${img.naturalWidth * 0.5}px`;
            img.style.height = `${img.naturalHeight * 0.5}px`;
        };

        const Buttons: HTMLDivElement = document.createElement("div");
        Buttons.classList.add("buttons");
        // added so it doesnt overlap with the img
        Buttons.style.left = `${item.imageCoords.x}%`;
        img.onload = () => {
            img.style.width = `${img.naturalWidth * 0.5}px`;
            img.style.height = `${img.naturalHeight * 0.5}px`;
            Buttons.style.transform = `translateX(${img.naturalWidth * 0.5 + 1}px)`;
        };
        Buttons.style.top = `${item.imageCoords.y}%`;

        Buttons.innerHTML = "";
        // get the array of action
        let ArrayOfActions: ActionReference[] | undefined = this._currentGameState?.actions;

        // Some interactables cant have certain actions, check happens here.
        if (item.type.includes("npc")) {
            ArrayOfActions = ArrayOfActions?.filter(action => action.alias === "examine" || action.alias === "talk");
        }
        if (item.type.includes("actionableItem")) {
            ArrayOfActions = ArrayOfActions?.filter(action => action.alias === "examine" || action.alias === "pick-up");
        }
        if (item.type.includes("actionableItemOpen")) {
            ArrayOfActions = ArrayOfActions?.filter(action => action.alias === "examine" || action.alias === "open");
        }
        if (ArrayOfActions) {
            ArrayOfActions.forEach((button: ActionReference) => {
                const buttonElement: HTMLElement = this.renderActionButton(button, item);
                Buttons.appendChild(buttonElement);
            });
        }
        img.addEventListener("click", () => this.handleClickItem(Buttons, img));
        container.appendChild(img);
        container.appendChild(Buttons);

        return container;
    }

    private lastButton: HTMLDivElement | undefined;
    private lastImg: HTMLImageElement | undefined;

    private handleClickItem(Buttons: HTMLDivElement, Img: HTMLImageElement): void {
        // makes the selection effect
        if (this.lastButton && this.lastImg) {
            this.lastButton.classList.remove("active");
            this.lastImg.classList.remove("active");
        }
        Buttons.classList.toggle("active");
        Img.classList.toggle("active");

        this.lastButton = Buttons;
        this.lastImg = Img;
    }

    private renderActionButton(button: ActionReference, item: ClickItem): HTMLElement {
        const element: HTMLElement = html`
            <a class="button">
                ${button.name}
            </a>
        `;

        element.addEventListener("click", (): void => {
            void this.handleClickAction(button, item);
        });

        return element;
    }

    private async handleClickAction(button: ActionReference, item: ClickItem): Promise<void> {
        console.log(button);
        console.log(item);

        const state: GameState | undefined = await this._gameRouteService.executeAction(button.alias, [item.alias]);
        console.log(state);
        if (state) {
            this.Connect(state);
        }
    }
}
