import { css, htmlArray } from "../helpers/webComponents";
import { GameRouteService } from "../services/GameRouteService";

/** CSS affecting the {@link QuestComponent} */
const styles: string = css`
    .ui-btn {
        font-family: "Onesize", sans-serif;
        font-size: 18px;
        font-weight: bold;
        background-color: #f0f0f0;
        border: 3px solid #222;
        color: #222;
        cursor: pointer;
        transition: all 0.2s;
    }

    .open-quest-btn {
        padding: 10px;
        position: absolute;
        top: 5%;
        right: 8%;
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
        font-weight: bold;
        margin-bottom: 5px;
    }
`;

interface Quest {
    title: string;
    description: string;
    objectives: string[];
    reward: string;
    completed: boolean;
}

const quests: Quest[] = [
    {
        title: "Find the Key",
        description: "A locked cabinet requires a key. Find and retrieve it.",
        objectives: ["Locate the key", "Unlock the cabinet"],
        reward: "Access to new area",
        completed: false,
    },
    {
        title: "Gather Materials",
        description: "Collect necessary items for crafting a parachute.",
        objectives: ["Find sheets", "Find a rope"],
        reward: "Parachute unlocked",
        completed: false,
    },
];

export class QuestComponent extends HTMLElement {
    private readonly _gameRouteService: GameRouteService = new GameRouteService();
    private activeQuests: Quest[] = [];

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private renderQuests(): string {
        let questCardsHTML: string = "";

        for (const quest of quests) {
            questCardsHTML += `
                <div class="quest-card">
                    <div class="quest-title">${quest.title}</div>
                    <p>${quest.description}</p>
                    <button class="ui-btn" data-title="${quest.title}">
                        ${this.activeQuests.includes(quest) ? "Complete" : "Accept"}
                    </button>
                </div>
            `;
        }

        return questCardsHTML;
    }

    private render(): void {
        if (!this.shadowRoot) return;

        const questCardsHTML: string = this.renderQuests();

        const elements: HTMLElement[] = htmlArray`
            <style>${styles}</style>
            <button class="open-quest-btn ui-btn" id="questButton">Quests</button>
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
        const questDialog: HTMLDialogElement = this.shadowRoot?.querySelector("#questDialog") as HTMLDialogElement;
        const openButton: HTMLButtonElement = this.shadowRoot?.querySelector("#questButton") as HTMLButtonElement;
        const closeButton: HTMLButtonElement = this.shadowRoot?.querySelector("#closeQuestDialog") as HTMLButtonElement;
        const questButtons: NodeListOf<HTMLButtonElement> = this.shadowRoot?.querySelectorAll(".quest-card .ui-btn") as NodeListOf<HTMLButtonElement>;

        openButton.addEventListener("click", () => questDialog.showModal());
        closeButton.addEventListener("click", () => questDialog.close());

        questButtons.forEach(button => {
            button.addEventListener("click", event => this.handleQuestAction(event));
        });
    }

    private handleQuestAction(event: Event): void {
        const button = event.target as HTMLButtonElement;
        const questTitle = button.getAttribute("data-title");
        const quest = quests.find(q => q.title === questTitle);
        if (!quest) return;

        if (this.activeQuests.includes(quest)) {
            this.completeQuest(quest);
        } else {
            this.acceptQuest(quest);
        }
    }

    private acceptQuest(quest: Quest): void {
        this.activeQuests.push(quest);
        this.updateDialog();
    }

    private async completeQuest(quest: Quest): Promise<void> {
        try {
            const success: boolean = await this._gameRouteService.completeQuest(quest.title);
            if (success) {
                this.activeQuests = this.activeQuests.filter(q => q !== quest);
                quest.completed = true;
                this.updateDialog();
            }
        } catch (error) {
            console.error("Error completing quest:", error);
        }
    }

    private updateDialog(): void {
        const questDialog: HTMLDialogElement = this.shadowRoot?.querySelector("#questDialog") as HTMLDialogElement;
        const isOpen: boolean = questDialog.open;

        this.render();
        if (isOpen) {
            const newQuestDialog: HTMLDialogElement = this.shadowRoot?.querySelector("#questDialog") as HTMLDialogElement;
            newQuestDialog.showModal();
        }
    }
}

customElements.define("quest-component", QuestComponent);
