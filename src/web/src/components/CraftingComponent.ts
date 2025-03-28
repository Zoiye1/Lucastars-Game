import { GameObjectReference, GameState } from "@shared/types";
import { css, htmlArray } from "../helpers/webComponents";
import { GameEventService } from "../services/GameEventService";
import { Page } from "../enums/Page";
import { CraftingRouteService } from "../services/CraftingRouteService";
import { GameRouteService } from "../services/GameRouteService";

/** CSS affecting the {@link CraftingComponent} */
const styles: string = css`
    .ui-btn {
        font-family: "Onesize", sans-serif;
        font-size: 18px;
        font-weight: bold;
        background-color: #f0f0f0;
        border: 3px solid #222;
        color: #222;
        cursor: pointer;
        transition: all 0.2s;
    }

    .open-crafting-btn {
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

    .open-crafting-btn img{
        width: 200%;
        height: 200%;
        object-fit: contain;
    }

    .ui-button:hover {
        background-color: #dfdfdf;
    }

    #closeDialog {
        font-family: "Onesize", sans-serif;
        background-color: #fff;
        padding: 0 5px;
        position: absolute;
        top: 10px;
        right: 10px;
        border: 1px solid black;
        background: transparent;
        border-radius: 5px;
        font-size: 32px;
        cursor: pointer;
        color: black;
        transition: all 0.3s ease
    }

    #closeDialog:hover {
        background-color: black;
        border: 1px solid black;
        color: white;
    }

    .container-slot {
        position: relative;
    }

    #emptySlot {
        position: absolute;
        top: -50%;
        right: 25%;
        background: transparent;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #333;
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
    }

    dialog {
        margin: 0;
        z-index: 3;
        top: 8%;
        left: 50%;
        transform: translateX(-55%); 
        border: none;
        background: #ffffffea;
        width: 700px;
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
        width: 50px;
        height: 50px;
        border: 2px dashed gray;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f0;
    }

    .slot-icon {
        width: 48px;
        object-fit: contain;
    }

    .symbol {
        font-size: 24px;
        font-weight: bold;
    }

    .recipes-list {
        max-height: 500px;
        overflow-y: auto;
        width: 200px;
        border-right: 2px dashed gray;
        padding: 10px;
    }

    .recipe-card {
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #ffffffa2;
    }

    .recipe-title {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .recipe-items {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 5px;
    }

    .recipe-item-icon {
        width: auto;
        height: 30px;
        background-color: #e0e0e0;
        border: 1px solid #aaa;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #555;
    }

    .dashed-divider {
        width: 100%;
        border-top: 2px dashed gray;
    }

    .container-craft-retrieve-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .dialog-button {
        font-family: "Onesize", sans-serif;
        font-size: 18px;
        font-weight: bold;
        background-color: #f0f0f0;
        border: 3px solid #222;
        margin-top: 20px;
        padding: 10px 20px;
        color: black;
        cursor: pointer;
        display: block;
        text-transform: uppercase;
        transition: all 0.2s ease;
    }

    .dialog-button:hover {
        background-color: black;
        color: white;
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

    .notification.error {
        background-color: #f8d7da;
        color: #721c24;
        border-color: #721c24;
    }

    .notification.fadeOut {
        opacity: 0;
    }

    .recipes-title {
        font-size: 1em;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
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
            <button class="open-crafting-btn" id="craftingButton">
                <img src="public/assets/img/CraftingButton.png" alt="crafting">
            </button>
            <dialog id="craftingDialog">
                <div class="container">
                    <button id="closeDialog">X</button>
                        <div class="container-crafting-recipes">
                            <div class="container-dialog">
                                <h2 class="crafting-title">Crafting Menu</h2>
                                <div class="crafting-grid">
                                    <div class="container-slot">
                                        ${this._slots[0] ? "<button id=\"emptySlot\" data-slot=\"0\">✕</button>" : ""}
                                        <div class="slot">${this._slots[0] !== "" ? `<img data-item="${this._slots[0]}" class="slot-icon" src="/public/assets/img/icons/${this._slots[0]}.png"/>` : ""}</div>
                                    </div>
                                    <span class="symbol">+</span>
                                    <div class="container-slot">
                                        ${this._slots[1] ? "<button id=\"emptySlot\" data-slot=\"1\">✕</button>" : ""}
                                        <div class="slot">${this._slots[1] !== "" ? `<img data-item="${this._slots[1]}" class="slot-icon" src="/public/assets/img/icons/${this._slots[1]}.png"/>` : ""}</div>
                                    </div>
                                    <span class="symbol">+</span>
                                    <div class="container-slot">
                                        ${this._slots[2] ? "<button id=\"emptySlot\" data-slot=\"2\">✕</button>" : ""}
                                        <div class="slot">${this._slots[2] !== "" ? `<img data-item="${this._slots[2]}" class="slot-icon" src="/public/assets/img/icons/${this._slots[2]}.png"/>` : ""}</div>
                                    </div>
                                    <span class="symbol">=</span>
                                    <div class="result-slot">${this._resultSlot !== "" ? `<img data-item="${this._resultSlot}" class="slot-icon" src="/public/assets/img/icons/${this._resultSlot}.png"/>` : ""}</div>
                                </div>
                                <div class="container-craft-retrieve-buttons">
                                    <button class="dialog-button" id="addSelectedItemButton">Add selected item</button>
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
        const addSelectedBtn: HTMLButtonElement = this.shadowRoot.querySelector("#addSelectedItemButton") as HTMLButtonElement;
        const retrieveBtn: HTMLButtonElement | null = this.shadowRoot.querySelector("#retrieveCraftedItem");

        button.addEventListener("click", () => dialog.show());
        closeBtn.addEventListener("click", () => dialog.close());

        addSelectedBtn.addEventListener("click", async () => {
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
