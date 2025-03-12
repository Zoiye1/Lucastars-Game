import { css, htmlArray } from "../helpers/webComponents";
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
        width: 250px;
        max-height: 400px; /* Set a max height */
        overflow-y: auto; /* Enable scrolling when content exceeds max height */
        color: white;
        scrollbar-width: thin; /* For Firefox */
        scrollbar-color: #4a90e2 #222; /* Custom scrollbar color */
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
        background: #4a90e2;
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
        grid-template-columns: 1fr;
        gap: 10px;
        margin-top: 10px;
    }

    .inventory-item {
        padding: 10px;
        background: linear-gradient(135deg,rgb(110, 130, 153),#af75db);
        border: 1px solid #af75db;
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
        background: linear-gradient(135deg,#ca58e0, #ca58e0);
        transform: scale(1.05);
    }

    .inventory-item.selected {
        background: linear-gradient(135deg,#ca58e0, #ca58e0);
        transform: scale(1.05);
        box-shadow: 0 0 10px #ca58e0, 0 0 20px rgba(202, 88, 224, 0.5);
        border: 2px solid #ffffff;
    }
`;

/**
 * Represents the Inventory Component
 */
export class InventoryComponent extends HTMLElement {
    private items: string[] = [];
    private readonly _gameRouteService: GameRouteService = new GameRouteService();
    private selectedItem: string | null = null;

    public async connectedCallback(): Promise <void> {
        this.attachShadow({ mode: "open" });
        await this.render();
    }

    public async render(): Promise<void> {
        await this.handleGetInventory();
        await this.handleGetSelectedItemInventory();

        if (!this.shadowRoot) return;

        const inventoryItems: string = this.items
            .map(item => {
                const selectedClass: string = item === this.selectedItem ? "selected" : "";
                return `<div class="inventory-item ${selectedClass}">${item}</div>`;
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
        this.addSelectItemListeners();
    }

    private addSelectItemListeners(): void {
        const selectItemDivs: NodeList | undefined = this.shadowRoot?.querySelectorAll(".inventory-item");

        selectItemDivs?.forEach(itemDiv => {
            itemDiv.addEventListener("click", async () => {
                if (itemDiv.textContent) {
                    await this.handleSelectItem(itemDiv.textContent);
                    await this.handleGetSelectedItemInventory();
                    this.render();
                }
            });
        });
    }

    private async handleGetInventory(): Promise<void> {
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
            const state: string | undefined = await this._gameRouteService.getSelectedItem();
            if (state) {
                this.selectedItem = state;
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}
