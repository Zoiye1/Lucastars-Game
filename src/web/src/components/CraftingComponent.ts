import { css, htmlArray } from "../helpers/webComponents";
import { GameRouteService } from "../services/GameRouteService";

/** CSS affecting the {@link CraftingComponent} */
const styles: string = css`
    .container-crafting-button {
        background-color: blue; 
        padding: 10px;
        position: absolute;
        border: none;
        top: 5%;
        right: 8%;
        color: #f0f0f0;
        cursor: pointer;
    }

    #closeDialog {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #333;
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
    }

    dialog {
        position: relative;
        border: none;
        padding: 0;
        background: #ffffffe4;
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

    .container-inventory {
        padding: 20px;
    }

    .dashed-divider {
        width: 100%;
        border-top: 2px dashed gray;
    }

    .inventory-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 10px;
        margin-top: 10px;
    }

    .inventory-item {
        padding: 10px;
        background-color: #eef;
        border: 1px solid #99c;
        border-radius: 5px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.2s;
    }

    .inventory-item:hover {
        background-color: #dde;
    }

    .inventory-title {
        margin: 0;
    }

    .container-craft-retrieve-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    #retrieveCraftedItem,
    #craftButton {
        margin-top: 20px;
        padding: 10px 20px;
        background-color: white;
        color: black;
        border: 2px solid black;
        cursor: pointer;
        border-radius: 5px;
        display: block;
        font-weight: bold;
        text-transform: uppercase;
        transition: all 0.2s ease;
    }

    #retrieveCraftedItem:hover,
    #craftButton:hover {
        background-color: black;
        color: white;
    }
`;

interface Recipe {
    title: string;
    ingredients: string[];
}

const recipes: Recipe[] = [
    {
        title: "Ladder",
        ingredients: ["10 Sticks", "Super Glue", "Hammer"],
    },
    {
        title: "Parachute",
        ingredients: ["Sheets", "Rope"],
    },
    {
        title: "Bomb",
        ingredients: ["Air freshener", "Lighter"],
    },
];

export class CraftingComponent extends HTMLElement {
    private readonly _gameRouteService: GameRouteService = new GameRouteService();

    private slots: string[] = ["", "", "", ""];
    private resultSlot: string = "";
    /**
     * The "constructor" of a Web Component
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
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
            <button class="container-crafting-button" id="craftingButton">Crafting</button>
            <dialog id="craftingDialog">
                <div class="container">
                    <button id="closeDialog">✕</button>

                    <div class="container-crafting-recipes">
                        <div class="container-dialog">
                            <h2>Crafting Menu</h2>
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
                                <button id="craftButton">Craft</button>
                                ${this.resultSlot ? "<button id=\"retrieveCraftedItem\">Retrieve</button>" : ""}
                            </div>
                        </div>
                        <div class="container-inventory">
                            <div class="dashed-divider"></div>
                            <h2 class="inventory-title">Your Inventory</h2>
                            <div class="inventory-grid">
                                <div class="inventory-item">Stick (x15)</div>
                                <div class="inventory-item">Super Glue (x3)</div>
                                <div class="inventory-item">Hammer (x1)</div>
                                <div class="inventory-item">Air freshener (x2)</div>
                                <div class="inventory-item">Lighter (x1)</div>
                                <div class="inventory-item">Focus Drink (x5)</div>
                                <div class="inventory-item">Baking Soda (x7)</div>
                                <div class="inventory-item">Rope</div>
                                <div class="inventory-item">Sheets</div>
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
        const craftBtn: HTMLButtonElement = this.shadowRoot.querySelector("#craftButton") as HTMLButtonElement;
        const retrieveBtn: HTMLButtonElement | null = this.shadowRoot.querySelector("#retrieveCraftedItem");

        button.addEventListener("click", () => dialog.showModal());
        closeBtn.addEventListener("click", () => dialog.close());

        // sluit modaal als gebruiker buiten modaal klikt
        dialog.addEventListener("click", event => {
            const dialogContent: HTMLDivElement = dialog.querySelector(".container")!;
            if (!dialogContent.contains(event.target as Node)) {
                dialog.close();
            }
        });

        craftBtn.addEventListener("click", () => this.handleCraftItem(this.slots));
        const resultSlot: HTMLDivElement = this.shadowRoot.querySelector(".result-slot") as HTMLDivElement;
        const resultItemAlias: string = resultSlot.innerText;
        retrieveBtn?.addEventListener("click", () => this.handleRetrieveItem(resultItemAlias));

        this.addClearSlotsListeners();
        this.addInventoryItemListeners();
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

    private addInventoryItemListeners(): void {
        const inventoryItems: NodeList | undefined = this.shadowRoot?.querySelectorAll(".inventory-item");

        inventoryItems?.forEach(inventoryItem => {
            inventoryItem.addEventListener("click", () => {
                const item: string = inventoryItem.textContent!;
                this.handleSelectItem(item);
            });
        });
    }

    private handleSelectItem(item: string): void {
        const firstEmptySlot: number = this.slots.findIndex(slot => slot === "");

        if (firstEmptySlot !== -1) {
            this.slots[firstEmptySlot] = item;
            this.updateDialog();
        }
        else {
            alert("All slots are full!");
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

            const ingredients: string[] = recipe.ingredients;

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
            newCraftingDialog.showModal();
        }
    }
}
