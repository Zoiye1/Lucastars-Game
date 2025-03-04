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

    dialog {
        position: relative;
        border: none;
        padding: 0;
    }

    .container-dialog {
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
`;

export class CraftingComponent extends HTMLElement {
    /**
     * The "constructor" of a Web Component
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }
        const elements: HTMLElement[] = htmlArray`
            <style>
                ${styles}
            </style>
            <button class="container-crafting-button" id="craftingButton">Crafting</button>
            <dialog id="craftingDialog">
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
