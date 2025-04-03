import { css, htmlArray } from "../helpers/webComponents";
import { CraftingRouteService } from "../services/CraftingRouteService";
import { GameRouteService } from "../services/GameRouteService";

/** CSS affecting the {@link InventoryComponent} */
const styles: string = css`
    .container-inventory {
    position: fixed;
    left: 0;
    top: 27%;
    transform: translateY(-50%);
    background: rgba(20, 20, 20, 0.95);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
    width: 300px; 
    max-height: 300px;
    overflow-y: auto;
    color: white;
    scrollbar-width: thin;
    scrollbar-color: #4a90e2 #222;
}
    .inventory-item::after {
    content: attr(data-item-name); /*  Tooltip haalt naam uit data-item */
    position: absolute;
    bottom: 100%; /*  Boven het item */
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 8px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    pointer-events: none; /*  Zorgt ervoor dat de tooltip de muis niet blokkeert */
}

.inventory-item:hover::after {
    opacity: 1; /*  Tooltip wordt zichtbaar bij hover */
}

    /* Scrollbar styling for WebKit browsers (Chrome, Edge, Safari) */
    .container-inventory::-webkit-scrollbar {
        width: 8px;
    }

    .container-inventory::-webkit-scrollbar-track {
        background: #222;
        border-radius: 10px;
    }

    .container-inventory::-webkit-scrollbar-thumb {
        background: #c6882a;
        border-radius: 10px;
    }

    .dashed-divider {
        width: 100%;
        border-top: 2px dashed gray;
        margin-bottom: 10px;
    }

    .inventory-title {
        margin: 0;
        font-size: 1.5rem;
        text-align: center;
    }

    .inventory-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: repeat(3, auto);
        gap: 10px;
        margin-top: 10px;

        
    }

    .inventory-item {
        padding: 10px;
        background: #c6882a;
        border: 1px solid #9f3f16;
        border-radius: 8px;
        text-align: center;
        font-size: 14px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
        transition: background 0.3s ease-in-out, transform 0.1s ease-in-out;
    }

    .inventory-item:hover {
        background: linear-gradient(135deg,#c6882a, #9f3f16);
        transform: scale(1.05);
    }

    .inventory-item.selected {
        background: linear-gradient(135deg,#c6882a, #9f3f16);
        transform: scale(1.05);
        box-shadow: 0 0 10px #9f3f16, 0 0 20px rgba(202, 88, 224, 0.5);
        border: 2px solid #9f3f16;
    }

    .inventory-icon {
        width: 64px;
        object-fit: contain;
        margin: 0 auto;
        display: block;
    }
`;

/**
 * Represents the Inventory Component
 */
export class InventoryComponent extends HTMLElement {
    private items: string[] = [];
    private readonly _gameRouteService: GameRouteService = new GameRouteService();
    private readonly _craftingRouteService: CraftingRouteService = new CraftingRouteService();
    private selectedItem: string | null = null;

    public async connectedCallback(): Promise <void> {
        this.attachShadow({ mode: "open" });
        await this.handleGetInventory();
        await this.handleGetSelectedItemInventory();
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        const containerElement: HTMLElement | null = this.shadowRoot.querySelector(".container-inventory");
        const previousScrollTop: number = containerElement ? containerElement.scrollTop : 0;

        const inventoryItems: string = this.items
            .map(item => {
                const itemName: string = item.replace("Item", "");
                const selectedClass: string = item === this.selectedItem ? "selected" : "";
                return `<div class="inventory-item ${selectedClass}" data-item-name="${itemName}"><img data-item="${item}" class="inventory-icon" src="/assets/img/icons/${item}.png"/></div>`;
            })
            .join("");

        const elements: HTMLElement[] = htmlArray`
            <style>${styles}</style>
            <div class="container-inventory">
                <div class="dashed-divider"></div>
                <h2 class="inventory-title">Your Inventory</h2>
                <div class="inventory-grid">
                    ${inventoryItems}
                </div>
            </div>
        `;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }

        this.shadowRoot.append(...elements);

        const newContainerElement: HTMLElement | null = this.shadowRoot.querySelector(".container-inventory");
        if (newContainerElement) {
            newContainerElement.scrollTop = previousScrollTop;
        }

        this.addSelectItemListeners();
    }

    private addSelectItemListeners(): void {
        const selectItemDivs: NodeList | undefined = this.shadowRoot?.querySelectorAll(".inventory-icon");

        selectItemDivs?.forEach(itemDiv => {
            itemDiv.addEventListener("click", async () => {
                const div: HTMLElement = itemDiv as HTMLElement;
                await this.handleSelectItem(div.dataset.item!);
                await this.handleGetSelectedItemInventory();
                this.render();
            });
        });
    }

    public async handleGetInventory(): Promise<void> {
        try {
            const state: string[] | undefined = await this._gameRouteService.getInventory();
            console.log(state);
            if (state) {
                this.items = state;
            }
            else {
                this.items = [];
            }
            this.render();
        }
        catch (error) {
            console.error("Error fetching inventory:", error);
            this.items = [];
            this.render();
        }
    }

    private async handleSelectItem(itemAlias: string): Promise<void> {
        try {
            await this._gameRouteService.executeSelectItem(itemAlias);
        }
        catch (error) {
            console.error(error);
        }
    }

    private async handleGetSelectedItemInventory(): Promise<void> {
        try {
            const state: string | undefined = await this._craftingRouteService.getSelectedItem();
            if (state) {
                this.selectedItem = state;
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}
