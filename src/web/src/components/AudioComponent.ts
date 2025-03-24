import { GameState } from "@shared/types";
import { GameRouteService } from "../services/GameRouteService";
import { css, html } from "../helpers/webComponents";
import { AudioService } from "../services/AudioService";

const styles: string = css`
    :host {
        display: block;
    }
    
    .mute-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #52478b;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .mute-button:hover {
        background-color: #332c57;
    }
`;

/**
 * Component for managing background music based on room
 */
export class AudioComponent extends HTMLElement {
    /** Instance of the game route service */
    private readonly _gameRouteService: GameRouteService = new GameRouteService();

    /** Audio service instance */
    private readonly _audioService: AudioService = AudioService.getInstance();

    /**
     * The "constructor" of a Web Component
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();

        window.addEventListener("state-update", () => {
            void this.refreshRoomState();
        });

        void this.refreshRoomState();
    }

    /**
     * Refresh the current room state
     */
    private async refreshRoomState(): Promise<void> {
        const state: GameState = await this._gameRouteService.getGameState();

        if (state.type !== "switch-page" && state.roomAlias) {
            console.log("roomalias", state.roomAlias);
            this._audioService.playRoomMusic(state.roomAlias);
        }
    }

    /**
     * Toggle the mute state
     */
    private toggleMute(): void {
        const isMuted: boolean = this._audioService.toggleMute();

        const muteButton: HTMLButtonElement | undefined = this.shadowRoot?.querySelector(".mute-button") as HTMLButtonElement | undefined;
        if (muteButton) {
            muteButton.textContent = isMuted ? "🔇" : "🔊";
        }
    }

    /**
     * Render the component
     */
    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const muteButton: HTMLElement = html`
            <button class="mute-button" title="Toggle Music">
                ${this._audioService.isMuted() ? "🔇" : "🔊"}
            </button>
        `;

        muteButton.addEventListener("click", () => {
            this.toggleMute();
        });

        const styleElement: HTMLElement = document.createElement("style");
        styleElement.textContent = styles;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }

        this.shadowRoot.appendChild(styleElement);
        this.shadowRoot.appendChild(muteButton);
    }
}
