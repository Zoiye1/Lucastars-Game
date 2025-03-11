import { css, htmlArray } from "../helpers/webComponents";

/** CSS affecting the {@link InventoryComponent} */
const styles: string = css`
    table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: 2px solid white;
        border-radius: 5px;
    }
    th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid white;
    }
    img {
        width: 40px;
        height: 40px;
    }

    /* CSS voor de inventory sectie */
    .inventory-section {
        display: none;
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        padding: 20px;
        border-radius: 10px;
        width: 80%;
        max-width: 400px;
    }

    .inventory-section.active {
        display: block;
    }

    .inventory-toggle {
        background-color: #007BFF;
        color: white;
        padding: 10px;
        border: none;
        cursor: pointer;
        border-radius: 5px;
    }
`;

/**
 * Represents the Inventory Component
 */
export class InventoryComponent extends HTMLElement {
    private items: string[] = [];
    private inventoryVisible: boolean = false;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Stel je voor dat we de PlayerSession ergens ophalen
        const playerSession: PlayerSession = {
            playerOpenedDoorToStorage: false,
            pickedUpSugar: true,
            pickedUpKey: true,
            currentRoom: "gym",
            inventory: ["key", "sugar", "hammer"],
            GaveTheForkToCook: false,
            ThreatenedCook: false,
            wantsToHelpCleaner: true,
            helpedCleaner: false,
            pickedUpFocusDrink: false,
            pickedUpHammer: true,
            pickedupSticks: false,
            pickedUpFork: false,
            pickedUpPainting: false,
            pickedUpKnife: false,
            helpedGymFreak: false,
            pickedUpBucket: false,
            pickedUpGlassBeaker: false,
            pickedUpSulfuricAcid: false,
            pickedUpJumpRope: false,
            placedEscapeLadder: false,
            tradedWithSmoker: false,
            ventUnlocked: false,
            windowBroken: false,
        };

        // Gebruik de inventory uit de PlayerSession
        this.items = playerSession.inventory;
        this.render();
    }

    private toggleInventory(): void {
        this.inventoryVisible = !this.inventoryVisible;
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const elements: HTMLElement[] = htmlArray`
            <style>${styles}</style>
            <div>
                <button class="inventory-toggle" @click="${this.toggleInventory.bind(this)}">Bekijk Inventory</button>
                <div class="inventory-section ${this.inventoryVisible ? "active" : ""}">
                    <h2>Inventory</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.items.map(item => htmlArray`
                                <tr>
                                    <td>${item}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }

        this.shadowRoot.append(...elements);
    }
}
