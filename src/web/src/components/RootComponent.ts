import { GameEvent } from "../enums/GameEvent";
import { Page } from "../enums/Page";
import { html } from "../helpers/webComponents";
import { GameEventService, SwitchPageEvent } from "../services/GameEventService";

/** Default page used by the {@link RootComponent} */
export const DefaultPage: Page = Page.Canvas;

/**
 * A "router" Web Component
 *
 * @remarks Will listen for the Switch Page event and render the requested page if possible. Otherwise, switches to a Not Found page.
 */
export class RootComponent extends HTMLElement {
    /** Instance of the game event service */
    private readonly _gameEventService: GameEventService = new GameEventService();

    /** Current active page */
    private _currentPage: Page = DefaultPage;

    /**
     * The "constructor" of a Web Component
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Listen for the Switch Page event
        this._gameEventService.addGameEventListener<SwitchPageEvent>(GameEvent.SwitchPage, event => {
            this.handleSwitchPage(event.page);
        });

        this.render();
    }

    /**
     * Render the contents of this page
     */
    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = this.renderCurrentPage();

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }

    /**
     * Render the current active page
     *
     * @returns HTML element of the current active page
     */
    private renderCurrentPage(): HTMLElement {
        switch (this._currentPage) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            case Page.Canvas:
                return html`<game-canvas></game-canvas>`;

            default:
                return html`<game-notfound page="${this._currentPage}"></game-notfound>`;
        }
    }

    /**
     * Switch to a different page
     *
     * @param page Page to switch to
     */
    private handleSwitchPage(page: Page): void {
        this._currentPage = page;

        this.render();
    }
}
