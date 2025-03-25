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

    /** Connection status */
    private _isConnected: boolean = false;

    /** Manual first room audio trigger needed flag */
    private _needsFirstRoomTrigger: boolean = true;

    /** Initial room check delay timer */
    private _initialCheckTimer?: number;

    /**
     * The "constructor" of a Web Component
     */
    public connectedCallback(): void {
        this._isConnected = true;
        this.attachShadow({ mode: "open" });

        console.log("Audio component connected");

        // Render initial state
        this.render();

        // Listen for state updates
        window.addEventListener("state-update", () => {
            if (this._isConnected) {
                void this.refreshRoomState();

                // If we see a state update, we'll trigger first room audio again to be safe
                if (this._needsFirstRoomTrigger) {
                    void this.handleFirstRoomAudio();
                }
            }
        });

        // Start polling for room state changes to catch all navigation methods
        this._audioService.startRoomStatePolling(this._gameRouteService);

        // Enable audio on first user interaction
        this.enableAudioOnInteraction();

        // Initial state check with a short delay to ensure DOM is ready
        this._initialCheckTimer = window.setTimeout(() => {
            void this.handleFirstRoomAudio();
        }, 1000);
    }

    /**
     * Specifically handle the first room audio
     * This adds additional checks to ensure the first room gets audio
     */
    private async handleFirstRoomAudio(): Promise<void> {
        if (!this._needsFirstRoomTrigger) return;

        try {
            const state: GameState = await this._gameRouteService.getGameState();
            console.log("Initial room state:", state);

            // Check for available room identifiers
            const roomAlias: string | undefined = state.roomAlias || state.currentRoom;

            if (roomAlias) {
                console.log("First room detected:", roomAlias);
                this._audioService.playRoomMusic(roomAlias);
                this._needsFirstRoomTrigger = false;
            }
            else {
                // If we can't find a room name, check again in 1 second
                window.setTimeout(() => {
                    void this.handleFirstRoomAudio();
                }, 1000);
            }
        }
        catch (error) {
            console.error("Error handling first room audio:");
        }
    }

    /**
     * Enable audio playback on first user interaction
     * This helps overcome browser autoplay restrictions
     */
    private enableAudioOnInteraction(): void {
        const unlockAudio = (): void => {
            // Create a silent audio element for unlocking
            const silentAudio: HTMLAudioElement = new Audio();
            silentAudio.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//tUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABYADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UgAAABDQAU3AAAAIlAApp4AAACUBoLuUEACrPFgRcRgABoAAAABBEREREREREAAAAAAAAAABERERERERMQAAAAAAAAAARERERERERAAAAAAAAAAAAACqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";
            silentAudio.volume = 0.01;

            void silentAudio.play().then(() => {
                silentAudio.pause();
                document.removeEventListener("click", unlockAudio);
                document.removeEventListener("touchstart", unlockAudio);
                console.log("Audio playback unlocked");

                // Force first room audio check after user interaction
                void this.handleFirstRoomAudio();
            }).catch(error => {
                console.error("Could not unlock audio:", error);
            });
        };

        document.addEventListener("click", unlockAudio);
        document.addEventListener("touchstart", unlockAudio);
    }

    /**
     * Lifecycle method when component is disconnected
     */
    public disconnectedCallback(): void {
        this._isConnected = false;
        this._audioService.stopRoomStatePolling();

        // Clean up timers
        if (this._initialCheckTimer) {
            clearTimeout(this._initialCheckTimer);
            this._initialCheckTimer = undefined;
        }
    }

    /**
     * Refresh the current room state
     */
    private async refreshRoomState(): Promise<void> {
        try {
            const state: GameState = await this._gameRouteService.getGameState();

            // Check for both roomAlias and currentRoom fields
            const roomAlias: string | undefined = state.roomAlias || state.currentRoom;

            // Only update if it's a room state
            if (state.type !== "switch-page" && roomAlias) {
                console.log("Audio component detected room:", roomAlias);
                this._audioService.playRoomMusic(roomAlias);

                // We successfully played music, so we don't need the first room trigger anymore
                this._needsFirstRoomTrigger = false;
            }
        }
        catch (error) {
            console.error("Error refreshing room state");
        }
    }

    /**
     * Toggle the mute state
     */
    private toggleMute(): void {
        const isMuted: boolean = this._audioService.toggleMute();

        // Update button icon
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

            // Clicking the mute button is also a good time to trigger the first room check
            if (this._needsFirstRoomTrigger) {
                void this.handleFirstRoomAudio();
            }
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
