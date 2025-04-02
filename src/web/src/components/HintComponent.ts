import { GameObjectReference, GameState } from "@shared/types";
import { css, htmlArray } from "../helpers/webComponents";
import { GameEventService } from "../services/GameEventService";
import { Page } from "../enums/Page";
import { GameRouteService } from "../services/GameRouteService";
import { HintRouteService } from "../services/HintService";

/** CSS affecting the {@link HintComponent} */
const styles: string = css`
    :host {
        display: block;
    }

    .hint-button {
        position: absolute;
        top: 75%;
        right: 12%;
        z-index: 1;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        width: 50px;
        height: 50px;
    }

    .hint-button img {
        width: 200%;
        height: 200%;
        object-fit: contain;
    }

    .notification {
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        background-color: rgba(20, 20, 20, 0.9);
        border: 2px solid #332c57;
        border-radius: 5px;
        text-align: center;
        z-index: 10;
        font-size: 18px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        opacity: 1;
        transition: opacity 0.5s ease;
        max-width: 80%;
        color: white;
    }
`;

type QuestArray = {
    NPC: string;
    startQuest: boolean;
    completed: boolean;
    description: string;
};

export type PlayerSession = {
    playerOpenedElevator: boolean;
    pickedUpGlue: boolean;
    pickedUpWirecutter: boolean;
    pickedUpKeyCard: boolean;
    playerOpenedCloset: boolean;
    playerOpenedDoorToStorage: boolean;
    wardrobeOpened: boolean;
    playerOpenedSteelbox: boolean;
    pickedUpSugar: boolean;
    pickedUpKey: boolean;
    /** Alias of the room the player is in */
    currentRoom: string;
    /** List of game object aliases the player owns */
    inventory: string[];
    selectedItemInventory: string;
    /** All booleans that determine game state */
    GaveTheForkToCook: boolean;
    ThreatenedCook: boolean;
    wantsToHelpCleaner: boolean;
    helpedCleaner: boolean;
    pickedUpFocusDrink: boolean;
    pickedUpHammer: boolean;
    pickedupSticks: boolean;
    pickedUpFork: boolean;
    pickedUpPainting: boolean;
    pickedUpKnife: boolean;
    helpedGymFreak: boolean;
    pickedUpBucket: boolean;
    pickedUpGlassBeaker: boolean;
    pickedUpSulfuricAcid: boolean;
    EscapedLab: boolean;
    HasVisitedStarterRoom: boolean;

    // Voeg de nieuwe activeQuest eigenschap toe
    activeQuest?: {
        name: string;
        item: string;
        completed: boolean;
    };
    pickedUpJumpRope: boolean;
    retrievedTenSticks: boolean;
    placedEscapeLadder: boolean;
    placedBomb: boolean;
    tradedWithSmoker: boolean;
    ventUnlocked: boolean;
    windowBroken: boolean;
    wantsToSearchGlassBeaker: boolean;
    wantsToSearchIngredients: boolean;
    wantsToHelpDealer: boolean;
    wantsToHelpProfessor: boolean;
    wantsToHelpGymFreak: boolean;
    wantsToHelpSmoker: boolean;
    wantsToHelpCook: boolean;
    pickedUpBakingSoda: boolean;
    helpedProfessor: boolean;
    questArray: QuestArray[];
    helpedDealer: boolean;
    helpedSmoker: boolean;
    helpedCook: boolean;
    pickedUpSheets: boolean;
    pickedUpAirFreshener: boolean;
    EscapedRoof: boolean;
};

type Hint = {
    condition: (session: PlayerSession) => boolean;
    text: string;
};

export class HintComponent extends HTMLElement {
    /** Verzameling van geselecteerde GameObject knoppen */
    private _selectedGameObjectButtons: Set<GameObjectReference> = new Set<GameObjectReference>();
    /** Instantie van de game event service */
    private readonly _gameEventService: GameEventService = new GameEventService();
    /** Instantie van de game route service */
    private readonly _gameRouteService: GameRouteService = new GameRouteService();
    /** Instantie van de hint route service */
    private readonly _hintRouteService: HintRouteService = new HintRouteService();

    private _playerSession: PlayerSession | undefined;
    /** Notification timeout ID */
    private _hintTimeoutId: number | null = null;

    private readonly _hints: Hint[] = [
        {
            condition: session => session.wantsToHelpCleaner && !session.helpedCleaner && !session.pickedUpBucket,
            text: "You can help the cleaner by picking up the bucket in the toilet.",
        },
        {
            condition: session => session.inventory.includes("LadderItem"),
            text: "You can place the ladder nearby a basket to climb out of here!",
        },
    ];

    /**
     * De "constructor" van een Web Component
     */
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.addEventListener("state-update", () => {
            void this.refreshGameState();
        });

        void this.refreshGameState();

        this.render();
    }

    /**
     * Vernieuw de huidige game state
     */
    private async refreshGameState(): Promise<void> {
        const state: GameState = await this._gameRouteService.getGameState();
        this._playerSession = await this.handleGetPlayerSession();

        this.updateGameState(state);
    }

    /**
     * Update de hint component naar de nieuwe game state
     *
     * @param state Game state om de component mee te updaten
     */
    private updateGameState(state: GameState): void {
        // Handle switching pages, if requested.
        if (state.type === "switch-page") {
            this._gameEventService.switchPage(state.page as Page);

            return;
        }

        this._selectedGameObjectButtons.clear();

        // Refresh the web component
        this.render();
    }

    /**
     * Verwijder een bestaande notificatie als deze er is
     */
    private removeExistingNotification(): void {
        const existingNotification: HTMLElement | null | undefined = this.shadowRoot?.getElementById("hint-notification");
        existingNotification?.remove();

        if (this._hintTimeoutId !== null) {
            window.clearTimeout(this._hintTimeoutId);
            this._hintTimeoutId = null;
        }
    }

    /**
     * Toon een notificatie aan de gebruiker
     *
     * @param success Boolean die aangeeft of de notificatie een succes of fout weergeeft
     * @param message De boodschap om te tonen
     * @param duration Tijd in ms dat de notificatie zichtbaar blijft
     */
    private showHintNotification(duration: number = 5000): void {
        this.removeExistingNotification();

        console.log(this._playerSession);
        const hintMessage: string = this.getRandomHint();

        const notificationElement: HTMLElement = document.createElement("div");
        notificationElement.innerHTML = `
            <div id="hint-notification" class="notification">
                ${hintMessage}
            </div>
        `;

        const notification: HTMLElement = notificationElement.firstElementChild as HTMLElement;
        this.shadowRoot?.appendChild(notification);

        this._hintTimeoutId = window.setTimeout(() => {
            notification.classList.add("fadeOut");

            window.setTimeout(() => {
                notification.remove();
            }, 500);
        }, duration);
    }

    /**
     * Verkrijg een random hint gebaseerd op playerSession
     */
    private getRandomHint(): string {
        if (!this._playerSession) {
            return "Hint system is loading. Please try again later.";
        }

        // Filtreer hints op basis van player session
        const relevantHints: Hint[] = this._hints.filter(hint => hint.condition(this._playerSession!));

        if (relevantHints.length === 0) {
            return "You're doing well! Keep exploring and interacting with the environment.";
        }

        const randomIndex: number = Math.floor(Math.random() * relevantHints.length);
        return relevantHints[randomIndex].text;
    }

    /**
     * Render de inhoud van deze component
     */
    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const elements: HTMLElement[] = htmlArray`
            <style>
                ${styles}
            </style>
            <button class="hint-button" id="hintButton">
                <img src="/assets/img/HintButton.png" alt="ask hint">
            </button>
        `;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }
        this.shadowRoot.append(...elements);

        const askHintButton: HTMLButtonElement = this.shadowRoot.querySelector(".hint-button") as HTMLButtonElement;

        askHintButton.addEventListener("click", () => {
            this.showHintNotification();
        });
    }

    /**
     * Verzoek aan de database (playerSession) om de playersession te krijgen
     */
    private async handleGetPlayerSession(): Promise<PlayerSession | undefined> {
        try {
            const state: PlayerSession | undefined = await this._hintRouteService.getPlayerSession();

            return state;
        }
        catch (error) {
            console.error(error);
        }
        return undefined;
    }
}
