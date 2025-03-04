import { css, htmlArray } from "../helpers/webComponents";

/** CSS affecting the {@link CraftingComponent} */
const styles: string = css`
    :host {
       background-color: blue; 
       padding: 5px;
       position: absolute;
       top: 5%;
       right: 5%;
       cursor: pointer;
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
            <dialog class="container-crafting-button">Crafting</dialog>
        `;

        elements[1].addEventListener("click", () => this.handleOpenCrafting(button));

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }
        this.shadowRoot.append(...elements);
    }
}
