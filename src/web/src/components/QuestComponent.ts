import { css, htmlArray } from "../helpers/webComponents";
import { GameRouteService } from "../services/GameRouteService";

const styles: string = css`
   :host {
        display: block;
    }

    .quest-button {
        position: absolute;
        top: 45%;
        right: 13%;
        z-index: 1;
        background: none;
        border: none;
        padding: 10px 15px
        font-size: 16px;
        cursor: pointer;
        width: 50px;
        height: 50px;
    }

    .quest-button img {
        width: 258%;
        height: 258%;
        object-fit: contain;
    }

    .quest-panel {
        display: none;
        position: absolute;
        top: 50px;
        right: 0;
        width: 300px;
        background-color: rgba(20, 20, 20, 0.95);
        border: 2px solid #332c57;
        border-radius: 8px;
        padding: 15px;
        color: white;
        max-height: 400px;
        overflow-y: auto;
    }

    .quest-panel.active {
        display: block;
    }

    .quest-title {
        text-align: center;
        font-size: 20px;
        margin-bottom: 15px;
        color: #7f6ed7;
    }

    .quest-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .quest-item {
        margin-bottom: 12px;
        padding: 10px;
        border-radius: 5px;
    }

    .quest-item.completed {
        background-color: rgba(56, 142, 60, 0.2);
    }

    .quest-item-title {
        font-weight: bold;
        display: flex;
        justify-content: space-between;
    }

    .description-toggle-btn {
        background: none;
        border: none;
        color: #7f6ed7;
        text-decoration: underline;
        cursor: pointer;
        font-size: 14px;
    }

    .hidden {
        display: none;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: #7f6ed7;
        font-size: 16px;
        cursor: pointer;
        padding: 5px;
    }
`;

type QuestArray = {
    NPC: string;
    startQuest: boolean;
    completed: boolean;
    description: string;
};

export class QuestComponent extends HTMLElement {
    private readonly _gameRouteService: GameRouteService = new GameRouteService();
    private activeQuests: QuestArray[] = [];
    private _isPanelOpen: boolean = false;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private renderQuests(): string {
        return this.activeQuests.map(quest => this.createQuestItem(quest)).join("");
    }

    private createQuestItem(quest: QuestArray): string {
        const statusClass: string = quest.completed ? "completed" : "";
        const statusText: string = quest.completed ? "Completed" : "In Progress";

        return `
            <li class="quest-item ${statusClass}">
                <div class="quest-item-title">
                    ${quest.NPC}
                    <span>${statusText}</span>
                </div>
                <p>${quest.startQuest ? "Start the quest" : "Complete the quest"}</p>
                <button class="description-toggle-btn">View description</button>
                <div class="quest-item-description hidden">
                    ${quest.description}
                </div>
            </li>
        `;
    }

    private render(): void {
        if (!this.shadowRoot) return;

        const questItemsHTML: string = this.renderQuests();
        const elements: HTMLElement[] = htmlArray`
            <style>${styles}</style>
            <button class="quest-button" id="questButton">
                <img src="/assets/img/QuestButton.png" alt="Quests">
            </button>
            <div class="quest-panel ${this._isPanelOpen ? "active" : ""}" id="questPanel">
                <button class="close-button" id="closeQuestPanel">✕</button>
                <div class="quest-title">Your Quests</div>
                <ul class="quest-list">
                    ${questItemsHTML}
                </ul>
            </div>
        `;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }
        this.shadowRoot.append(...elements);

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        if (!this.shadowRoot) return;

        const openButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#questButton");
        const closeButton: HTMLButtonElement | null = this.shadowRoot.querySelector("#closeQuestPanel");

        if (openButton) {
            openButton.addEventListener("click", () => this.openQuestPanel());
        }

        if (closeButton) {
            closeButton.addEventListener("click", () => this.closeQuestPanel());
        }

        this.addDescriptionToggleListeners();
    }

    private addDescriptionToggleListeners(): void {
        if (!this.shadowRoot) return;

        const toggleButtons: NodeListOf<HTMLButtonElement> = this.shadowRoot.querySelectorAll(".description-toggle-btn");

        toggleButtons.forEach(button => {
            button.addEventListener("click", event => {
                const target: HTMLButtonElement = event.target as HTMLButtonElement;
                const descriptionDiv: HTMLElement | null = target.nextElementSibling as HTMLElement;

                if (descriptionDiv && descriptionDiv.classList.contains("hidden")) {
                    descriptionDiv.classList.remove("hidden");
                    target.textContent = "Hide description";
                } else if (descriptionDiv) {
                    descriptionDiv.classList.add("hidden");
                    target.textContent = "View description";
                }
            });
        });
    }

    private async openQuestPanel(): Promise<void> {
        await this.handleGetActiveQuests();
        this._isPanelOpen = true;
        this.render();
    }

    private closeQuestPanel(): void {
        this._isPanelOpen = false;
        this.render();
    }

    private async handleGetActiveQuests(): Promise<void> {
        try {
            const success: QuestArray[] = await this._gameRouteService.executeGetQuests() as QuestArray[];
            this.activeQuests = success;
            this.render();
        } catch (error) {
            console.error("Error fetching active quests:", error);
        }
    }
}
