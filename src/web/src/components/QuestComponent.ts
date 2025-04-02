import { css, htmlArray } from "../helpers/webComponents";
import { GameRouteService } from "../services/GameRouteService";

/** CSS affecting the {@link QuestComponent} */
const styles: string = css`
    .ui-btn {
        font-family: "Onesize", sans-serif;
        font-size: 18px;
        font-weight: bold;
        background-color: #7f6ed7;
        border: 2px solid #332c57;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
    }

    .open-quest-btn {
        position: absolute;
        top: 47%;
        right: 12%;
        z-index: 1;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        width: 50px;
        height: 50px;
    }

    .open-quest-btn img{
        width: 200%;
        height: 200%;
        object-fit: contain;
    }

    .quest-list {
        max-height: 500px;
        overflow-y: auto;
        width: 300px;
        border-right: 2px dashed gray;
        padding: 10px;
    }

    .quest-card {
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #ffffffa2;
        
    }

    .quest-title {
        text-align: center;
        font-size: 20px;
        margin-bottom: 15px;
        color: #7f6ed7;
    }

    .description-toggle-btn {
        background: none;
        border: none;
        color: #0066cc;
        text-decoration: underline;
        cursor: pointer;
        font-size: 14px;
        margin: 5px 0;
        padding: 0;
    }

    .quest-description {
        padding: 8px;
        background-color: #f9f9f9;
        border-radius: 4px;
        margin-top: 5px;
        font-size: 14px;
    }

    .hidden {
        display: none;
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

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private renderQuests(): string {
        let questCardsHTML: string = "";

        for (const quest of this.activeQuests) {
            questCardsHTML += `
                <div class="quest-card">
                    <div class="quest-title">${quest.NPC}</div>
                    <p>${quest.startQuest ? "Start the quest" : "Complete the quest"}</p>
                    <button class="ui-btn" data-title="${quest.NPC}">
                        ${quest.completed ? "Completed" : "In Progress"}
                    </button>
                    <div class="quest-description-toggle">
                        <button class="description-toggle-btn">View description</button>
                        <div class="quest-description hidden">
                            <p>${quest.description}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        return questCardsHTML;
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const questCardsHTML: string = this.renderQuests();
        const elements: HTMLElement[] = htmlArray`
            <style>${styles}</style>
            <button class="open-quest-btn ui-btn" id="questButton">
                <img src="/assets/img/QuestButton.png" alt="Quests">
            </button>
            
            <dialog id="questDialog">
                <div class="quest-list">${questCardsHTML}</div>
                <button class="ui-btn" id="closeQuestDialog">✕</button>
            </dialog>
        `;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }
        this.shadowRoot.append(...elements);

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const questDialog: HTMLDialogElement = this.shadowRoot?.querySelector(
            "#questDialog"
        ) as HTMLDialogElement;
        const openButton: HTMLButtonElement = this.shadowRoot?.querySelector(
            "#questButton"
        ) as HTMLButtonElement;
        const closeButton: HTMLButtonElement = this.shadowRoot?.querySelector(
            "#closeQuestDialog"
        ) as HTMLButtonElement;

        openButton.addEventListener("click", () => this.openQuestDialog());
        closeButton.addEventListener("click", () => questDialog.close());

        // Voeg event listeners toe voor de beschrijving toggles
        this.addDescriptionToggleListeners();
    }

    private addDescriptionToggleListeners(): void {
        if (!this.shadowRoot) return;

        const toggleButtons: NodeListOf<HTMLButtonElement> = this.shadowRoot.querySelectorAll(".description-toggle-btn");

        toggleButtons.forEach(button => {
            button.addEventListener("click", event => {
                const target: HTMLButtonElement = event.target as HTMLButtonElement;
                const descriptionDiv: HTMLElement = target.nextElementSibling as HTMLElement;

                // Toggle de zichtbaarheid van de beschrijving
                if (descriptionDiv.classList.contains("hidden")) {
                    descriptionDiv.classList.remove("hidden");
                    target.textContent = "Hide description";
                }
                else {
                    descriptionDiv.classList.add("hidden");
                    target.textContent = "View description";
                }
            });
        });
    }

    private async openQuestDialog(): Promise<void> {
        await this.handleGetActiveQuests();
        const questDialog: HTMLDialogElement = this.shadowRoot?.querySelector(
            "#questDialog"
        ) as HTMLDialogElement;
        questDialog.showModal();
    }

    private async handleGetActiveQuests(): Promise<void> {
        try {
            const success: QuestArray[] | undefined = await this._gameRouteService.executeGetQuests() as QuestArray[];
            this.activeQuests = success; // activeQuests wordt bijgewerkt met de quests uit de DB
            this.updateDialog();
        }
        catch (error) {
            console.error("Error fetching active quests:", error);
        }
    }

    private updateDialog(): void {
        const questDialog: HTMLDialogElement = this.shadowRoot?.querySelector(
            "#questDialog"
        ) as HTMLDialogElement;
        const isOpen: boolean = questDialog.open;

        this.render();
        if (isOpen) {
            const newQuestDialog: HTMLDialogElement = this.shadowRoot?.querySelector(
                "#questDialog"
            ) as HTMLDialogElement;
            newQuestDialog.showModal();
        }
    }
}
