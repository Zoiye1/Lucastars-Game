import { GameObjectReference, GameState } from "@shared/types";
import { css, htmlArray } from "../helpers/webComponents";
import { GameEventService } from "../services/GameEventService";
import { Page } from "../enums/Page";
import { CraftingRouteService } from "../services/CraftingRouteService";
import { GameRouteService } from "../services/GameRouteService";

/** CSS affecting the {@link CraftingComponent} */
const styles: string = css`
    :host {
        display: block;
    }

    .crafting-button {
        position: absolute;
        top: 0%;
        right: 12%;
        z-index: 1;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        width: 50px;
        height: 50px;
    } 

    .crafting-button:hover{
        filter: brightness(0.5);
    }

    .crafting-button img {
        width: 200%;
        height: 200%;
        object-fit: contain;
    }

    dialog {
        margin: 0;
        z-index: 3;
        top: 6%;
        left: 50%;
        transform: translateX(-55%); 
        border: none;
        background: rgba(20, 20, 20, 0.95);
        width: 700px;
        border: 2px solid #332c57;
        border-radius: 8px;
        color: white;
    }

    #closeDialog {
        font-family: "Onesize", sans-serif;
        background-color: transparent;
        padding: 0 5px;
        position: absolute;
        top: 10px;
        right: 10px;
        border: 1px solid #7f6ed7;
        border-radius: 5px;
        font-size: 24px;
        cursor: pointer;
        color: #7f6ed7;
        transition: all 0.3s ease;
    }

    #closeDialog:hover {
        background-color: #7f6ed7;
        color: white;
    }

    .container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-evenly;
    }

    .container-crafting-recipes {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .crafting-title {
        text-align: center;
        font-size: 20px;
        margin-bottom: 15px;
        color: #7f6ed7;
    }

    .container-dialog {
        gap: 20px;
        padding: 20px;
        border-radius: 8px;
    }

    .crafting-grid {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
    }

    .slot, .result-slot {
        width: 60px;
        height: 60px;
        background-color: rgba(127, 110, 215, 0.2);
        border: 1px solid #332c57;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .slot:hover, .result-slot:hover {
        background-color: rgba(127, 110, 215, 0.4);
    }

    .slot.filled, .result-slot.filled {
        background-color: rgba(56, 142, 60, 0.2);
    }

    .slot-icon {
        max-width: 80%;
        max-height: 80%;
        object-fit: contain;
    }

    .symbol {
        font-size: 24px;
        font-weight: bold;
        color: #7f6ed7;
    }

    .container-slot {
        position: relative;
    }

    #emptySlot {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #d32f2f;
        border: 1px solid #b71c1c;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        cursor: pointer;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    #emptySlot:hover {
        background-color: #b71c1c;
        transform: scale(1.1);
    }

    .recipes-list {
        max-height: 500px;
        overflow-y: auto;
        width: 200px;
        border-right: 2px solid #332c57;
        padding: 10px;
    }

    .recipe-card {
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #332c57;
        border-radius: 5px;
        background-color: rgba(127, 110, 215, 0.1);
        transition: all 0.3s ease;
    }

    .recipe-card:hover {
        background-color: rgba(127, 110, 215, 0.2);
    }

    .recipe-title {
        font-weight: bold;
        margin-bottom: 5px;
        color: #fff;
    }

    .recipe-items {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 5px;
    }

    .recipe-item-icon {
        background-color: rgba(127, 110, 215, 0.2);
        border: 1px solid #332c57;
        border-radius: 4px;
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #ccc;
    }

    .dashed-divider {
        width: 100%;
        border-top: 2px solid #332c57;
    }

    .container-craft-retrieve-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
    }

    .dialog-button {
        font-family: "Onesize", sans-serif;
        font-size: 16px;
        font-weight: bold;
        background-color: #7f6ed7;
        border: 2px solid #332c57;
        padding: 8px 15px;
        color: white;
        cursor: pointer;
        border-radius: 5px;
        text-transform: uppercase;
        transition: all 0.3s ease;
    }

    .dialog-button:hover {
        background-color: #332c57;
        transform: scale(1.05);
    }

    #craftButton {
        background-color: #388e3c;
    }

    #craftButton:hover {
        background-color: #2e7d32;
    }

    #retrieveCraftedItem {
        background-color: #388e3c;
    }

    #retrieveCraftedItem:hover {
        background-color: #2e7d32;
    }

    .notification {
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        background-color: rgba(20, 20, 20, 0.9);
        border: 2px solid #332c57;
        border-radius: 5px;
        text-align: center;
        z-index: 10;
        font-size: 18px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        opacity: 1;
        transition: opacity 0.5s ease;
        max-width: 80%;
        color: white;
    }

    .notification.success {
        border-color: #388e3c;
        background-color: rgba(56, 142, 60, 0.2);
    }

    .notification.error {
        border-color: #d32f2f;
        background-color: rgba(211, 47, 47, 0.2);
    }

    .notification.fadeOut {
        opacity: 0;
    }

    .recipes-title {
        font-size: 1em;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
        color: #7f6ed7;
    }
`;

/**
 * Interface voor een crafting recept
 */
interface Recipe {
    title: string;
    ingredients: string[];
    ingredientsAliases: string[];
}

/**
 * Beschikbare recepten voor crafting
 */
const recipes: Recipe[] = [
    {
        title: "Ladder",
        ingredients: ["10 Sticks", "Glue", "Hammer"],
        ingredientsAliases: ["10Sticks", "HammerItem", "GlueItem"],

    },
    {
        title: "Parachute",
        ingredients: ["Sheets", "Rope"],
        ingredientsAliases: ["SheetsItem", "JumpRopeItem"],
    },
    {
        title: "Bomb",
        ingredients: ["Air freshener", "Lighter"],
        ingredientsAliases: ["AirFreshenerItem", "LighterItem"],
    },
];

export class CraftingComponent extends HTMLElement {
    /** Verzameling van geselecteerde GameObject knoppen */
    private _selectedGameObjectButtons: Set<GameObjectReference> = new Set<GameObjectReference>();
    /** Instantie van de game event service */
    private readonly _gameEventService: GameEventService = new GameEventService();
    /** Instantie van de game route service */
    private readonly _gameRouteService: GameRouteService = new GameRouteService();
    /** Instantie van de crafting route service */
    private readonly _craftingRouteService: CraftingRouteService = new CraftingRouteService();
    /** Momenteel geselecteerd item uit de inventaris */
    private _selectedItemInventory: string = "";
    /** Notification timeout ID */
    private _notificationTimeoutId: number | null = null;

    /** Array met items in de crafting slots */
    private _slots: string[] = ["", "", ""];
    /** Item in de resultaat slot */
    private _resultSlot: string = "";

    /**
     * De "constructor" van een Web Component
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.addEventListener("state-update", () => {
            void this.refreshGameState();
        });

        void this.refreshGameState();

        this.render();
    }

    /**
     * Vernieuw de huidige game state
     */
    private async refreshGameState(): Promise<void> {
        const state: GameState = await this._gameRouteService.getGameState();

        this.updateGameState(state);
    }

    /**
     * Update de crafting component naar de nieuwe game state
     *
     * @param state Game state om de component mee te updaten
     */
    private updateGameState(state: GameState): void {
        // Handle switching pages, if requested.
        if (state.type === "switch-page") {
            this._gameEventService.switchPage(state.page as Page);

            return;
        }

        this._selectedGameObjectButtons.clear();

        // Refresh the web component
        this.render();
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
     * Toon een notificatie aan de gebruiker
     *
     * @param success Boolean die aangeeft of de notificatie een succes of fout weergeeft
     * @param message De boodschap om te tonen
     * @param duration Tijd in ms dat de notificatie zichtbaar blijft
     */
    private showCraftNotification(success: boolean, message: string, duration: number = 3000): void {
        this.removeExistingNotification();

        const notificationElement: HTMLElement = document.createElement("div");
        notificationElement.innerHTML = `
            <div id="crafting-notification" class="notification ${success ? "success" : "error"}">
                ${message}
            </div>
        `;

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
     * Genereer de HTML voor de recepten lijst
     *
     * @returns HTML string voor de recepten lijst
     */
    private renderRecipes(): string {
        let recipeCardsHTML: string = "";

        for (const recipe of recipes) {
            let itemsHTML: string = "";
            for (const ingredient of recipe.ingredients) {
                itemsHTML += `
                <div class="recipe-item-icon">${ingredient}</div>
                `;
            }

            recipeCardsHTML += `
                <div class="recipe-card">
                    <div class="recipe-title">${recipe.title}</div>
                    <div class="recipe-items">
                        ${itemsHTML}
                    </div>
                </div>
            `;
        }

        return recipeCardsHTML;
    }

    /**
     * Render de inhoud van deze component
     */
    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const recipeCardsHTML: string = this.renderRecipes();

        const elements: HTMLElement[] = htmlArray`
            <style>
                ${styles}
            </style>
            <button class="crafting-button" id="craftingButton">
                <img src="/assets/img/CraftingButton.png" alt="crafting">
            </button>
            <dialog id="craftingDialog">
                <div class="container">
                    <button id="closeDialog">X</button>
                        <div class="container-crafting-recipes">
                            <div class="container-dialog">
                                <h2 class="crafting-title">Crafting Menu</h2>
                                <div class="crafting-grid">
                                    <div class="container-slot">
                                        ${this._slots[0] && !this._resultSlot ? "<button id=\"emptySlot\" data-slot=\"0\">✕</button>" : ""}
                                        <div class="slot ${this._slots[0] !== "" ? "filled" : ""}">${this._slots[0] !== "" ? `<img data-item="${this._slots[0]}" class="slot-icon" src="/public/assets/img/icons/${this._slots[0]}.png"/>` : ""}</div>
                                    </div>
                                    <span class="symbol">+</span>
                                    <div class="container-slot">
                                        ${this._slots[1] && !this._resultSlot ? "<button id=\"emptySlot\" data-slot=\"1\">✕</button>" : ""}
                                        <div class="slot ${this._slots[1] !== "" ? "filled" : ""}">${this._slots[1] !== "" ? `<img data-item="${this._slots[1]}" class="slot-icon" src="/public/assets/img/icons/${this._slots[1]}.png"/>` : ""}</div>
                                    </div>
                                    <span class="symbol">+</span>
                                    <div class="container-slot">
                                        ${this._slots[2] && !this._resultSlot ? "<button id=\"emptySlot\" data-slot=\"2\">✕</button>" : ""}
                                        <div class="slot ${this._slots[2] !== "" ? "filled" : ""}">${this._slots[2] !== "" ? `<img data-item="${this._slots[2]}" class="slot-icon" src="/public/assets/img/icons/${this._slots[2]}.png"/>` : ""}</div>
                                    </div>
                                    <span class="symbol">=</span>
                                    <div class="result-slot ${this._resultSlot !== "" ? "filled" : ""}">${this._resultSlot !== "" ? `<img data-item="${this._resultSlot}" class="slot-icon" src="/public/assets/img/icons/${this._resultSlot}.png"/>` : ""}</div>
                                </div>
                                <div class="container-craft-retrieve-buttons">
                                    ${!this._resultSlot ? "<button class=\"dialog-button\" id=\"addSelectedItemButton\">Add selected item</button>" : ""}
                                    ${this._resultSlot
                                        ? "<button class=\"dialog-button\" id=\"retrieveCraftedItem\">Retrieve</button>"
                                        : "<button class=\"dialog-button\" id=\"craftButton\">Craft</button>"
                                    }
                                </div>
                            </div>
                        </div>
                    <div class="recipes-list">
                            <h2 class="recipes-title">Recipes List</h2>
                            ${recipeCardsHTML}
                    </div>    
                </div>
            </dialog>
        `;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }
        this.shadowRoot.append(...elements);

        const button: HTMLButtonElement = this.shadowRoot.querySelector("#craftingButton") as HTMLButtonElement;
        const dialog: HTMLDialogElement = this.shadowRoot.querySelector("#craftingDialog") as HTMLDialogElement;
        const closeBtn: HTMLButtonElement = this.shadowRoot.querySelector("#closeDialog") as HTMLButtonElement;
        const craftBtn: HTMLButtonElement | null = this.shadowRoot.querySelector("#craftButton");
        const addSelectedBtn: HTMLButtonElement | null = this.shadowRoot.querySelector("#addSelectedItemButton");
        const retrieveBtn: HTMLButtonElement | null = this.shadowRoot.querySelector("#retrieveCraftedItem");

        button.addEventListener("click", () => dialog.show());
        closeBtn.addEventListener("click", () => dialog.close());

        addSelectedBtn?.addEventListener("click", async () => {
            await this.handleGetSelectedItemInventory();
            this.handleUpdateSlots(this._selectedItemInventory);
            this.updateDialog();
        });

        craftBtn?.addEventListener("click", () => {
            const previousResultSlot: string = this._resultSlot;
            this.handleCraftItem(this._slots);

            if (!this._resultSlot) {
                this.showCraftNotification(false, "Oops... This crafting combination did not work!");
            }
            else if (previousResultSlot !== this._resultSlot) {
                const displayString: string = this._resultSlot.replace("Item", "");
                this.showCraftNotification(true, `Success! You have crafted a ${displayString}!`);
            }
        });

        retrieveBtn?.addEventListener("click", async () => {
            await this.handleRetrieveItem(this._resultSlot);
            const displayString: string = this._resultSlot.replace("Item", "");

            await this.handleDeleteItems(this._slots);

            // stuur event naar canvas component voor retrieve notificatie
            this.dispatchEvent(new CustomEvent("show-retrieve-notification", {
                bubbles: true,
                composed: true,
                detail: { message: `You have saved the ${displayString} in the inventory!` },
            }));

            await this.refreshGameState();
        });

        this.addClearSlotsListeners();
    }

    /**
     * Voeg event listeners toe aan de leegmaak-knoppen voor de slots
     */
    private addClearSlotsListeners(): void {
        const clearSlotButtons: NodeList | undefined = this.shadowRoot?.querySelectorAll("#emptySlot");

        clearSlotButtons?.forEach(button => {
            button.addEventListener("click", event => {
                const slotIndex: number = parseInt((event.target as HTMLButtonElement).getAttribute("data-slot")!);
                this._slots[slotIndex] = "";
                this.updateDialog();
            });
        });
    }

    /**
     * Voeg een item toe aan de eerste beschikbare slot
     *
     * @param item Het item dat toegevoegd moet worden
     */
    private handleUpdateSlots(item: string): void {
        const firstEmptySlot: number = this._slots.findIndex(slot => slot === "");

        if (firstEmptySlot !== -1 && !this._slots.includes(item)) {
            this._slots[firstEmptySlot] = item;
            this.updateDialog();
        }
    }

    /**
     * Craft de item en zet het in de result slot
     *
     * @param slots string array die de craft items representeert
     */
    private handleCraftItem(slots: string[]): void {
        const filledSlots: string[] = slots.filter(slot => slot !== "");
        let matchingRecipe: Recipe | null = null;

        for (const recipe of recipes) {
            // als hoeveelheid niet gelijk is, ga naar volgende ingredient
            if (recipe.ingredientsAliases.length !== filledSlots.length) {
                continue;
            }

            const ingredients: string[] = recipe.ingredientsAliases;

            const sortedSlots: string[] = [...filledSlots].sort();
            const sortedIngredients: string[] = [...ingredients].sort();

            let match: boolean = true;
            for (let i: number = 0; i < sortedSlots.length; i++) {
                if (sortedSlots[i] !== sortedIngredients[i]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                matchingRecipe = recipe;
            }
        }

        if (matchingRecipe) {
            this._resultSlot = matchingRecipe.title + "Item";
        }
        else {
            this.emptySlotItems();
        }

        this.updateDialog();
    }

    /**
     * Verzoek aan de database (playerSession) om de gekozen item te sturen
     */
    private async handleGetSelectedItemInventory(): Promise<void> {
        try {
            const state: string | undefined = await this._craftingRouteService.getSelectedItem();
            if (state) {
                this._selectedItemInventory = state;
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    /**
     * Verstuur een verzoek naar de database (playerSession) om een item op te slaan in inventory
     *
     * @param itemAlias string die de gemaakte item representeert
     */
    private async handleRetrieveItem(itemAlias: string): Promise<void> {
        try {
            const state: string | undefined = await this._craftingRouteService.executeRetrieveItem(itemAlias);
            if (state) {
                this.updateDialog();
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    /**
     * Verstuur een verzoek om de items die gebruikt zijn in de craft te verwijderen uit de inventory
     *
     * @param itemAlias string array die de verwijderde items representeert
     */
    private async handleDeleteItems(itemAliases: string[]): Promise<void> {
        try {
            const state: string | undefined = await this._craftingRouteService.executeDeleteItem(itemAliases);
            if (state) {
                this.emptySlotItems();
                this.updateDialog();
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    private emptySlotItems(): void {
        this._slots = ["", "", "", ""];
        this._resultSlot = "";
    }

    private updateDialog(): void {
        const craftingDialog: HTMLDialogElement = this.shadowRoot?.querySelector("#craftingDialog") as HTMLDialogElement;
        const dialogOpenState: boolean = craftingDialog.open;

        this.render();

        // zorg ervoor dat de dialoog niet sluit na klikken
        if (dialogOpenState) {
            const newCraftingDialog: HTMLDialogElement = this.shadowRoot?.querySelector("#craftingDialog") as HTMLDialogElement;
            newCraftingDialog.show();
        }
    }
}
