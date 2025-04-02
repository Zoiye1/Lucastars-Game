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
        grid-template-rows: 5vh 50vh 30vh 15vh;
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

    game-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    margin: 0;
    height: 100%;                       
    aspect-ratio: 2 / 1; 
    
    }
    
    game-click {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    margin: 0;
    height: 100%;                       
    aspect-ratio: 2 / 1; 
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

    /* Typewriter effect styles */
    .typewriter {
        display: inline-block;
        white-space: pre-wrap;
        overflow: hidden;
        border-right: 0.15em solid orange; /* Cursor effect */
        animation: blink-caret 0.75s step-end infinite;
    }

    @keyframes blink-caret {
        from, to { border-color: transparent; }
        50% { border-color: orange; }
    }

    /* Item name highlighting */
    .item-name {
        color: #ff5252; /* Red color for item names */
        font-weight: bold;
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
    
    
    /* Add responsive design for better mobile experience */
    @media (max-width: 768px) {
        :host {
            grid-template-rows: auto 45vh auto auto;
        }
        
        .footer {
            height: auto;
            min-height: 105px;
        }
    }

    .notification {
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        background-color: #fff;
        border: 3px solid #222;
        border-radius: 5px;
        text-align: center;
        z-index: 10;
        font-size: 18px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        opacity: 1;
        transition: opacity 0.5s ease;
        max-width: 80%;
    }

    .notification.success {
        background-color: #d4edda;
        color: #155724;
        border-color: #155724;
    }

    .notification.fadeOut {
        opacity: 0;
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
    /** Store previous text to detect changes */
    private _previousText: string = "";
    /** Typewriter interval reference for cleanup */
    private _typewriterInterval?: NodeJS.Timeout;
    /** Cached list of item names for highlighting */
    private _itemNames: string[] = [];
    /** Notification timeout ID */
    private _notificationTimeoutId: number | null = null;

    /**
     * The "constructor" of a Web Component
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.addEventListener("state-update", () => {
            void this.refreshGameState();
        });
        this.addEventListener("state-update-click", event => {
            const customEvent: CustomEvent<GameState> = event as CustomEvent<GameState>;
            this.refreshGameStateAction(customEvent.detail);
        });
        this.addEventListener("show-retrieve-notification", event => {
            const customEvent: CustomEvent<{ message: string }> = event as CustomEvent<{ message: string }>;
            const message: string = customEvent.detail.message;
            void this.refreshGameState();

            setTimeout(() => {
                this.showRetrieveNotification(message);
            }, 500);
        });

        void this.refreshGameState();
    }

    /**
     * Refresh the current game state
     */
    private async refreshGameState(): Promise<void> {
        const state: GameState = await this._gameRouteService.getGameState();
        this.updateGameState(state);
    }

    private refreshGameStateAction(state: GameState): void {
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

        // Apply typewriter effect to the content if text has changed
        const newText: string = this._currentGameState?.text.join(" ") || "";
        if (newText !== this._previousText) {
            this.typeWriterEffect(newText, "typewriter");
            this._previousText = newText;
        }
        else {
            const typewriterElement: HTMLElement | null = this.shadowRoot.querySelector("#typewriter");
            if (typewriterElement) {
                typewriterElement.innerHTML = this.highlightItemNamesInText(newText);
            }
        }
    }

    /**
     * Highlight item names in text
     *
     * @param text The text to process
     * @returns Text with HTML for highlighted item names
     */
    private highlightItemNamesInText(text: string): string {
        if (!this._itemNames.length) return text;

        let processedText: string = text;

        // Look for item names and wrap them in spans
        this._itemNames.forEach((itemName: string) => {
            // Case insensitive global replace
            const regex: RegExp = new RegExp(`\\b${this.escapeRegExp(itemName)}\\b`, "gi");
            processedText = processedText.replace(regex, `<span class="item-name">${itemName}</span>`);
        });

        return processedText;
    }

    /**
     * Escape special characters for RegExp
     *
     * @param text The text to escape for RegExp
     * @returns Escaped text safe for RegExp
     */
    private escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
        const room: string | undefined = this._currentGameState?.roomAlias;
        if (roomImages && roomImages.length > 0) {
            // checks if the components should be displayed
            if (room !== "startup" && room !== "lab-end" && room !== "RoofEndRoom" && room !== "toilet-end" && room !== "courtyard-end" && room !== "GymEnd") {
                return `
                <div class="header">
                    ${roomImages.map((url: string) => `<img src="/assets/img/rooms/${url}.png" 
                    id="room-image"
                    onerror="this.onerror=null;this.src='/assets/img/rooms/${url}.gif';" />`).join("")}
                    <game-arrow></game-arrow>
                    <game-click></game-click>
                    <game-crafting></game-crafting>
                    <game-quest></game-quest>
                    <game-map></game-map>
                    <game-inventory> </game-inventory>
                </div>
            `;
            }
            else {
                return `
                <div class="header">
                    ${roomImages.map((url: string) => `<img src="/assets/img/rooms/${url}.png" 
                    onerror="this.onerror=null;this.src='/assets/img/rooms/${url}.gif';" />`).join("")}
                </div>
            `;
            }
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
                <span id="typewriter" class="typewriter"></span>
            </div>
        `;
    }

    /**
     * Verwijder een bestaande notificatie als deze er is
     */
    private removeExistingNotification(): void {
        const existingNotification: HTMLElement | null | undefined = this.shadowRoot?.getElementById("crafting-notification");
        existingNotification?.remove();

        if (this._notificationTimeoutId !== null) {
            window.clearTimeout(this._notificationTimeoutId);
            this._notificationTimeoutId = null;
        }
    }

    /**
     * Toon een notificatie aan de gebruiker wanneer gebruiker gecrafte item opslaat in inventory
     * @param message De boodschap om te tonen
     * @param duration Tijd in ms dat de notificatie zichtbaar blijft
     */
    private showRetrieveNotification(message: string, duration: number = 3000): void {
        this.removeExistingNotification();

        const notificationElement: HTMLElement = document.createElement("div");
        notificationElement.innerHTML = `<div class="notification success">${message}</div>`;

        const notification: HTMLElement = notificationElement.firstElementChild as HTMLElement;
        this.shadowRoot?.appendChild(notification);

        this._notificationTimeoutId = window.setTimeout(() => {
            notification.classList.add("fadeOut");
            window.setTimeout(() => {
                notification.remove();
            }, 500);
        }, duration);
    }

    /**
     * Apply a typewriter effect to the specified element with item name highlighting
     *
     * @param text The text to display with the typewriter effect
     * @param elementId The ID of the element to apply the effect to
     * @param speed The speed of the typewriter effect in milliseconds per character
     */
    private typeWriterEffect(text: string, elementId: string, speed: number = 27): void {
        // Clear any existing typewriter effect
        if (this._typewriterInterval) {
            clearInterval(this._typewriterInterval);
        }

        const element: HTMLElement | null | undefined = this.shadowRoot?.getElementById(elementId);
        if (!element) return;

        element.innerHTML = ""; // Clear the element before starting the animation

        // Pre-process the text to mark up the item names
        const highlightedText: string = this.highlightItemNamesInText(text);

        // Create a temporary DOM element to parse the HTML
        const tempContainer: HTMLDivElement = document.createElement("div");
        tempContainer.innerHTML = highlightedText;

        // Extract text nodes and spans (which contain item names)
        const nodes: (Node | HTMLSpanElement)[] = [];
        this.extractNodesRecursive(tempContainer, nodes);

        let currentNodeIndex: number = 0;
        let currentCharIndex: number = 0;
        let currentNode: Node | HTMLSpanElement = nodes[0];

        // Function to get next character, handling HTML nodes properly
        // eslint-disable-next-line @typescript-eslint/typedef
        const getNextChar = (): { char: string; isHtml: boolean } | null => {
            if (currentNodeIndex >= nodes.length) return null;

            currentNode = nodes[currentNodeIndex];

            // If it's a text node
            if (currentNode.nodeType === Node.TEXT_NODE) {
                const nodeText: string = currentNode.textContent || "";
                if (currentCharIndex >= nodeText.length) {
                    currentNodeIndex++;
                    currentCharIndex = 0;
                    return getNextChar();
                }
                return {
                    char: nodeText[currentCharIndex++],
                    isHtml: false,
                };
            }
            // If it's an element node (like our span)
            else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                // Return the whole element at once
                currentNodeIndex++;
                currentCharIndex = 0;
                return {
                    char: (currentNode as HTMLElement).outerHTML,
                    isHtml: true,
                };
            }

            // Skip other node types
            currentNodeIndex++;
            currentCharIndex = 0;
            return getNextChar();
        };

        this._typewriterInterval = setInterval(() => {
            const nextChar: { char: string; isHtml: boolean } | null = getNextChar();

            if (!nextChar) {
                clearInterval(this._typewriterInterval as NodeJS.Timeout);
                this._typewriterInterval = undefined;
                return;
            }

            if (nextChar.isHtml) {
                // For HTML elements (spans with item names), add the whole element at once
                element.innerHTML += nextChar.char;
            }
            else {
                // For regular text, add character by character
                element.innerHTML += nextChar.char;
            }

            // Auto-scroll to follow the text
            element.scrollIntoView({ behavior: "smooth", block: "end" });
        }, speed);
    }

    /**
     * Helper method to extract text nodes and elements recursively
     *
     * @param node The node to extract from
     * @param result The array to store results in
     */
    private extractNodesRecursive(node: Node, result: (Node | HTMLSpanElement)[]): void {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent && node.textContent.trim()) {
                result.push(node);
            }
        }
        else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName === "SPAN" && (node as HTMLElement).classList.contains("item-name")) {
                // Keep item name spans as a single unit
                result.push(node as HTMLSpanElement);
            }
            else {
                // Recursively process other elements
                for (let i: number = 0; i < node.childNodes.length; i++) {
                    this.extractNodesRecursive(node.childNodes[i], result);
                }
            }
        }
    }

    /**
     * Skip the current typewriter animation
     */
    private skipTypewriter(): void {
        if (this._typewriterInterval) {
            clearInterval(this._typewriterInterval);
            this._typewriterInterval = undefined;

            const typewriterElement: HTMLElement | null | undefined = this.shadowRoot?.querySelector("#typewriter");
            if (typewriterElement && this._previousText) {
                typewriterElement.innerHTML = this.highlightItemNamesInText(this._previousText);
            }
        }
    }

    /**
     * Render the footer element
     *
     * @returns HTML element of the footer
     */
    private renderFooter(): HTMLElement {
        const gameObjectsReferences: GameObjectReference[] | undefined = this._currentGameState?.objects;
        const gameActionRefrences: ActionReference[] | undefined = this._currentGameState?.actions;
        let filtratedObjects: GameObjectReference[] = [];
        let filtratedActions: ActionReference[] | undefined = [];

        const selectedButton: ActionReference | undefined = this._selectedActionButton;

        // checks if action is valid
        filtratedActions = gameActionRefrences?.filter(
            (gameActionRefrences: ActionReference) =>
                !["examine", "pick-up"].some(action => gameActionRefrences.alias.includes(action)));
        // filter gameObjects gebaseerd op action alias
        if (selectedButton && selectedButton.alias === "examine") {
            // geen filter nodig
            filtratedObjects = gameObjectsReferences || [];
        }
        else if (selectedButton && selectedButton.alias === "talk") {
            filtratedObjects = gameObjectsReferences?.filter(
                (gameObjectReference: GameObjectReference) => gameObjectReference.type.includes("npc")
            ) || [];
        }
        else if (selectedButton && selectedButton.alias === "place") {
            filtratedObjects = gameObjectsReferences?.filter(
                (gameObjectReference: GameObjectReference) => gameObjectReference.type.includes("place")
            ) || [];
        }
        else {
            // game objects waar een action op werkt anders dan talk of examine (alleen items als game objects)
            filtratedObjects = gameObjectsReferences?.filter(
                (gameObjectReference: GameObjectReference) => gameObjectReference.type.includes("actionableItem")
            ) || [];
        }

        return html`
            <div class="footer">
                <div class="buttons">
                    <div>
                       ${filtratedActions?.map((button: ActionReference) => this.renderActionButton(button))} 
                    </div>
                    <div>
                        ${this._selectedActionButton
                            ? filtratedObjects.map((button: GameObjectReference) => this.renderGameObjectButton(button))
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
     * @param button Action button that should be rendered
     * @returns HTML element of the action button
     */
    private renderActionButton(button: ActionReference): HTMLElement {
        if (button.alias === "talk") {
            const element: HTMLElement = html`
            <a>
            </a>
        `;
            return element;
        }
        const element: HTMLElement = html`
            <a class="button ${this._selectedActionButton === button ? "active" : ""}">
                ${button.name}
            </a>
        `;

        element.addEventListener("click", (): void => {
            // Skip typewriter effect when clicking buttons
            this.skipTypewriter();
            void this.handleClickAction(button);
        });

        return element;
    }

    /**
     * Render a game object button for a given game object reference
     *
     * @param button Game object button that should be rendered
     * @returns HTML element of the game object button
     */
    private renderGameObjectButton(button: GameObjectReference): HTMLElement {
        const element: HTMLElement = html`
            <a class="button ${this._selectedGameObjectButtons.has(button) ? "active" : ""}">
                ${button.name}
            </a>
        `;

        element.addEventListener("click", (): void => {
            // Skip typewriter effect when clicking buttons
            this.skipTypewriter();
            void this.handleClickGameObject(button);
        });

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
        const state: GameState | undefined = await this._gameRouteService.executeAction(button.alias);

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
            [...this._selectedGameObjectButtons].map((e: GameObjectReference) => e.alias)
        );

        console.log(state);

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
