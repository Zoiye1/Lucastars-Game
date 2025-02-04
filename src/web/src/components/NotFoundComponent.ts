import { css, html } from "../helpers/webComponents";
import { GameEventService } from "../services/GameEventService";
import { DefaultPage } from "./RootComponent";

/** CSS affecting the {@link NotFoundComponent} */
const styles: string = css`
    a {
        color: inherit;
    }

    a:hover {
        text-decoration: none;
    }
`;

/**
 * Represents the Not Found page
 */
export class NotFoundComponent extends HTMLElement {
    /** Instance of the game event service */
    private readonly _gameEventService: GameEventService = new GameEventService();

    /** Page that was attempted to be switched to */
    private _page: string | undefined;

    /**
     * The "constructor" of a Web Component
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Get the value of the page attribute
        this._page = this.attributes.getNamedItem("page")?.value;

        this.render();
    }

    /**
     * Render the contents of this page
     */
    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = this.renderNotFound();

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }

    /**
     * Render the Not Found page
     *
     * @returns HTML element of the Not Found page
     */
    private renderNotFound(): HTMLElement {
        const element: HTMLElement = html`
            <div>
                <style>
                    ${styles}
                </style>

                <h1>404 - Not found</h1>

                <p>Page '${this._page}' could not be found!</p>

                <p>Click <a href="#" id="back-to-home">here</a> to go back to the default page.</p>
            </div>
        `;

        element.querySelector("#back-to-home")?.addEventListener("click", e => {
            e.preventDefault();

            this._gameEventService.switchPage(DefaultPage);
        });

        return element;
    }
}
