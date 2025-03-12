import { css, htmlArray } from "../helpers/webComponents";
import { GameRouteService } from "../services/GameRouteService";
import { InventoryComponent } from "./InventoryComponent";

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
        padding: 10px;
        position: absolute;
        top: 5%;
        right: 8%;
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
        top: 10%;
        left: 50%;
        transform: translateX(-50%); 
        border: none;
        background: #ffffffea;
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
`;

interface Recipe {
    title: string;
    ingredients: string[];
    ingredientsAliases: string[];
}

const recipes: Recipe[] = [
    {
        title: "Ladder",
        ingredients: ["10 Sticks", "Super Glue", "Hammer"],
        ingredientsAliases: ["Sticks", "Super Glue", "HammerItem"],

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
    private readonly _gameRouteService: GameRouteService = new GameRouteService();
    private selectedItemInventory: string = "";

    private slots: string[] = ["", "", "", ""];
    private resultSlot: string = "";
    /**
     * The "constructor" of a Web Component
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private async refreshInventory(): Promise<void> {
        const root: HTMLElement | null = document.querySelector("game-root");
        const canvas: HTMLElement | null | undefined = root?.shadowRoot?.querySelector("game-canvas");
        const inventory: InventoryComponent | null | undefined = canvas?.shadowRoot?.querySelector("game-inventory");

        await inventory?.handleGetInventory();
    }

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

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const recipeCardsHTML: string = this.renderRecipes();

        const elements: HTMLElement[] = htmlArray`
            <style>
                ${styles}
            </style>
            <button class="open-crafting-btn ui-btn" id="craftingButton">Crafting</button>
            <dialog id="craftingDialog">
                <div class="container">
                    <button id="closeDialog">X</button>

                    <div class="container-crafting-recipes">
                        <div class="container-dialog">
                            <h2 class="crafting-title">Crafting Menu</h2>
                            <div class="crafting-grid">
                                <div class="container-slot">
                                    ${this.slots[0] ? "<button id=\"emptySlot\" data-slot=\"0\">✕</button>" : ""}
                                    <div class="slot">${this.slots[0]}</div>
                                </div>
                                <span class="symbol">+</span>
                                <div class="container-slot">
                                    ${this.slots[1] ? "<button id=\"emptySlot\" data-slot=\"1\">✕</button>" : ""}
                                    <div class="slot">${this.slots[1]}</div>
                                </div>
                                <span class="symbol">+</span>
                                <div class="container-slot">
                                    ${this.slots[2] ? "<button id=\"emptySlot\" data-slot=\"2\">✕</button>" : ""}
                                    <div class="slot">${this.slots[2]}</div>
                                </div>
                                <span class="symbol">+</span>
                                <div class="container-slot">
                                    ${this.slots[3] ? "<button id=\"emptySlot\" data-slot=\"3\">✕</button>" : ""}
                                    <div class="slot">${this.slots[3]}</div>
                                </div>
                                <span class="symbol">=</span>
                                <div class="result-slot">${this.resultSlot}</div>
                            </div>
                            <div class="container-craft-retrieve-buttons">
                                <button class="dialog-button" id="addSelectedItemButton">Add selected item</button>
                                ${this.resultSlot
                                    ? "<button class=\"dialog-button\" id=\"retrieveCraftedItem\">Retrieve</button>"
                                    : "<button class=\"dialog-button\" id=\"craftButton\">Craft</button>"
                                }
                            </div>
                        </div>
                    </div>
                    <div class="recipes-list">
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
            this.handleUpdateSlots(this.selectedItemInventory);
            this.updateDialog();
        });

        craftBtn?.addEventListener("click", () => this.handleCraftItem(this.slots));
        const resultSlot: HTMLDivElement = this.shadowRoot.querySelector(".result-slot") as HTMLDivElement;
        const resultItemAlias: string = resultSlot.innerText;
        retrieveBtn?.addEventListener("click", async () => {
            await this.handleDeleteItems(this.slots);
            await this.handleRetrieveItem(resultItemAlias);
            await this.refreshInventory();
        });

        this.addClearSlotsListeners();
    }

    private addClearSlotsListeners(): void {
        const clearSlotButtons: NodeList | undefined = this.shadowRoot?.querySelectorAll("#emptySlot");

        clearSlotButtons?.forEach(button => {
            button.addEventListener("click", event => {
                const slotIndex: number = parseInt((event.target as HTMLButtonElement).getAttribute("data-slot")!);
                this.slots[slotIndex] = "";
                this.updateDialog();
            });
        });
    }

    private handleUpdateSlots(item: string): void {
        const firstEmptySlot: number = this.slots.findIndex(slot => slot === "");

        if (firstEmptySlot !== -1 && !this.slots.includes(item)) {
            this.slots[firstEmptySlot] = item;
            this.updateDialog();
            console.log(this.slots);
        }
    }

    private handleCraftItem(slots: string[]): void {
        const filledSlots: string[] = slots.filter(slot => slot !== "");
        let matchingRecipe: Recipe | null = null;

        for (const recipe of recipes) {
            // als hoeveelheid niet gelijk is, ga naar volgende ingredient
            if (recipe.ingredients.length !== filledSlots.length) {
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
            this.resultSlot = matchingRecipe.title;
        }
        else {
            this.emptySlotItems();
        }

        this.updateDialog();
    }

    private async handleGetSelectedItemInventory(): Promise<void> {
        try {
            const state: string | undefined = await this._gameRouteService.getSelectedItem();
            if (state) {
                this.selectedItemInventory = state;
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    private async handleRetrieveItem(itemAlias: string): Promise<void> {
        try {
            const state: string | undefined = await this._gameRouteService.executeRetrieveItem(itemAlias);
            if (state) {
                this.emptySlotItems();
                this.updateDialog();
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    private async handleDeleteItems(itemAliases: string[]): Promise<void> {
        try {
            const state: string | undefined = await this._gameRouteService.executeDeleteItem(itemAliases);
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
        this.slots = ["", "", "", ""];
        this.resultSlot = "";
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
