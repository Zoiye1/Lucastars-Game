import { css, htmlArray } from "../helpers/webComponents";

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

    #craftButton {
        margin-top: 20px;
        padding: 10px 20px;
        background-color: green;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .container {
        display: flex;
        flex-direction: row-reverse;
    }

    dialog {
        position: relative;
        border: none;
        padding: 0;
    }

    .container-dialog {
        gap: 20px;
        padding: 20px 40px;
        background: white;
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
        max-height: 240px;
        overflow-y: auto;
        width: 200px;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 8px;
        background-color: #fafafa;
    }

    .recipe-card {
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
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
        title: "Bomb",
        ingredients: ["Air freshener", "Lighter"],
    },
    {
        title: "Corrosive Acid",
        ingredients: ["Focus Drink", "Baking Soda", "Sulfuric", "Glass Beaker"],
    },
];

export class CraftingComponent extends HTMLElement {
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
                    <div class="container-dialog">
                        <button id="closeDialog">✕</button>
                        <h2>Crafting Menu</h2>
                        <div class="crafting-grid">
                            <div class="slot"></div>
                            <span class="symbol">+</span>
                            <div class="slot"></div>
                            <span class="symbol">+</span>
                            <div class="slot"></div>
                            <span class="symbol">=</span>
                            <div class="result-slot"></div>
                        </div>
                        <button id="craftButton">Craft</button>
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

        button.addEventListener("click", () => dialog.showModal());
        closeBtn.addEventListener("click", () => dialog.close());

        // sluit modaal als gebruiker buiten modaal klikt
        dialog.addEventListener("click", event => {
            const dialogContent: HTMLDivElement = dialog.querySelector(".container-dialog")!;
            if (!dialogContent.contains(event.target as Node)) {
                dialog.close();
            }
        });
    }
}
