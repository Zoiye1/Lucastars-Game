import { ActionReference, DefaultGameState, GameObjectReference, GameState } from "@shared/types";
import { css, html, htmlArray } from "../helpers/webComponents";
import { GameEventService } from "../services/GameEventService";
import { GameRouteService } from "../services/GameRouteService";
import { Page } from "../enums/Page";

/** CSS affecting the {@link CanvasComponent} */
const styles: string = css`
    :host {
        font-family: "Onesize";
        width: 100%;
        max-width: 1024px;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 48px calc(50vh + 10px) minmax(calc(35vh + 10px), 1fr) auto;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        position: relative;
    }

    .title {
        text-align: center;
        margin-top: 10px;
        overflow: auto;
    }

    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        margin-top: 10px;
    }

    .header img {
        width: auto;
        height: 100%;
        image-rendering: pixelated;
    }

    .header img:nth-child(n + 2) {
        position: absolute;
    }

    .content {
        flex-grow: 1;
        overflow: auto;
        margin-top: 10px;
        padding: 0 10px;
    }

    .content p {
        margin: 0 0 10px 0;
    }

    .content p:last-of-type {
        margin: 0;
    }

    .footer {
        border-radius: 10px 10px 0 0;
        background-color: #52478b;
        border: 1px solid #332c57;
        margin-top: 10px;
        display: flex;
        height: 105px;
    }

    .footer .buttons {
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding: 10px 10px 0 10px;
    }

    .footer .button {
        background-color: #7f6ed7;
        border: 1px solid #332c57;
        padding: 5px 10px;
        margin: 0 0 10px 10px;
        text-transform: uppercase;
        cursor: pointer;
        display: inline-block;
        user-select: none;
    }

    .footer .button.active,
    .footer .button:hover {
        background-color: #332c57;
    }
`;

/**
 * Represents the Canvas page
 */
export class CanvasComponent extends HTMLElement {
    /** Instance of the game event service */
    private readonly _gameEventService: GameEventService = new GameEventService();
    /** Instance of the game route service */
    private readonly _gameRouteService: GameRouteService = new GameRouteService();

    /** Current game state */
    private _currentGameState?: DefaultGameState;
    /** Current active action button */
    private _selectedActionButton?: ActionReference;
    /** Current active game object buttons */
    private _selectedGameObjectButtons: Set<GameObjectReference> = new Set<GameObjectReference>();

    /**
     * The "constructor" of a Web Component
     */
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

        this._selectedActionButton = undefined;
        this._selectedGameObjectButtons.clear();

        // Refresh the web component
        this.render();
    }

    /**
     * Render the contents of this page
     */
    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const elements: HTMLElement[] = htmlArray`
            <style>
                ${styles}
            </style>

            ${this.renderTitle()}
            ${this.renderHeader()}
            ${this.renderContent()}
            ${this.renderFooter()}
        `;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }

        this.shadowRoot.append(...elements);
    }

    /**
     * Render the title element
     *
     * @returns String with raw HTML for the title element. Can be empty.
     */
    private renderTitle(): string {
        const roomName: string | undefined = this._currentGameState?.roomName;

        if (roomName) {
            return `<div class="title">${roomName}</div>`;
        }

        return "";
    }

    /**
     * Render the header element
     *
     * @returns String with raw HTML for the header element. Can be empty.
     */
    private renderHeader(): string {
        const roomImages: string[] | undefined = this._currentGameState?.roomImages;
        if (roomImages && roomImages.length > 0) {
            return `
                <div class="header">
                    ${roomImages.map(url => `<img src="/assets/img/rooms/${url}.png" />`).join("")}
                    <game-crafting></game-crafting>
                    <game-map></game-map>
                </div>
            `;
        }

        return "";
    }

    /**
     * Render the content element
     *
     * @returns String with raw HTML for the content element
     */
    private renderContent(): string {
        return `
            <div class="content">
                ${this._currentGameState?.text.map(text => `<p>${text}</p>`).join("") || ""}
            </div>
        `;
    }

    /**
     * Render the footer element
     *
     * @returns HTML element of the footer
     */
    private renderFooter(): HTMLElement {
        const gameObjectsReferences: GameObjectReference[] | undefined = this._currentGameState?.objects;
        let filtratedObjects: GameObjectReference[] | undefined = [];

        const selectedButton: ActionReference | undefined = this._selectedActionButton;

        // filter gameObjects gebaseerd op action alias
        if (selectedButton && selectedButton.alias === "examine") {
            // geen filter nodig
            filtratedObjects = gameObjectsReferences;
        }
        else if (selectedButton && selectedButton.alias === "talk") {
            filtratedObjects = gameObjectsReferences?.filter(gameObjectReference => gameObjectReference.type.includes("npc"));
        }
        else {
            // game objects waar een action op werkt anders dan talk of examine (alleen items als game objects)
            filtratedObjects = gameObjectsReferences?.filter(gameObjectReference => gameObjectReference.type.includes("actionableItem"));
        }

        return html`
            <div class="footer">
                <div class="buttons">
                    <div>
                        ${this._currentGameState?.actions.map(button => this.renderActionButton(button))}
                    </div>
                    <div>
                        ${this._selectedActionButton
                            ? filtratedObjects?.map(button => this.renderGameObjectButton(button)) || ""
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render an action button for a given action reference
     *
     * @returns HTML element of the action button
     */
    private renderActionButton(button: ActionReference): HTMLElement {
        const element: HTMLElement = html`
            <a class="button ${this._selectedActionButton === button ? "active" : ""}">
                ${button.name}
            </a>
        `;

        element.addEventListener("click", () => this.handleClickAction(button));

        return element;
    }

    /**
     * Render a game object button for a given game object reference
     *
     * @returns HTML element of the game object button
     */
    private renderGameObjectButton(button: GameObjectReference): HTMLElement {
        const element: HTMLElement = html`
            <a class="button ${this._selectedGameObjectButtons.has(button) ? "active" : ""}">
                ${button.name}
            </a>
        `;

        element.addEventListener("click", () => this.handleClickGameObject(button));

        return element;
    }

    /**
     * Handle the click on an action button
     *
     * @param button Action button that was clicked
     */
    private async handleClickAction(button: ActionReference): Promise<void> {
        // If this actions needs a game object, show the available game objects.
        if (button.needsObject) {
            this._selectedActionButton = button;
            this._selectedGameObjectButtons.clear();

            this.render();

            return;
        }

        // Otherwise, execute the action and update the game state.
        const state: GameState | undefined = await this._gameRouteService.executeMoveAction(button.alias);

        if (state === undefined) {
            return;
        }

        this.updateGameState(state);
    }

    /**
     * Handle the click on a game object button
     *
     * @param button Game object button that was clicked
     */
    private async handleClickGameObject(button: GameObjectReference): Promise<void> {
        // If no action button was clicked, do not try to handle this click.
        if (!this._selectedActionButton) {
            return;
        }

        // Add the game object to list of selected game objects
        this._selectedGameObjectButtons.add(button);

        // Try to execute the action with all game objects on the list
        const state: GameState | undefined = await this._gameRouteService.executeAction(
            this._selectedActionButton.alias,
            [...this._selectedGameObjectButtons].map(e => e.alias)
        );

        // If 2 more game objects where on the list, clear it.
        if (this._selectedGameObjectButtons.size >= 2) {
            this._selectedActionButton = undefined;
            this._selectedGameObjectButtons.clear();
        }

        // Refresh the web component
        this.render();

        // If no state was returned, exit silently. This can happen when an action needs more than 1 game object.
        if (state === undefined) {
            return;
        }

        // Otherwise, update the game state.
        this.updateGameState(state);
    }
}
