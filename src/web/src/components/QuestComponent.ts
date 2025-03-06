export class QuestComponent {
    private activeQuest: { description: string; progress: number; goal: number } | null = null;

    /**
     * Start een nieuwe fetch quest.
     * @param description - Beschrijving van de quest.
     * @param goal - Het aantal items dat verzameld moet worden.
     */
    public startFetchQuest(description: string, goal: number): void {
        this.activeQuest = { description, progress: 0, goal };
    }

    /**
     * Update de voortgang van de huidige quest.
     * @param amount - Hoeveelheid voortgang (bijv. 1 item toegevoegd).
     */
    public updateProgress(amount: number): void {
        if (this.activeQuest) {
            this.activeQuest.progress += amount;
            if (this.activeQuest.progress >= this.activeQuest.goal) {
                console.log("Quest voltooid!");
                this.completeQuest();
            }
        }
    }

    /**
     * Voltooi de huidige quest.
     */
    public completeQuest(): void {
        if (this.activeQuest) {
            console.log(`Gefeliciteerd! Je hebt de quest voltooid: ${this.activeQuest.description}`);
            this.activeQuest = null;
        }
    }

    /**
     * Haal de actieve quest op.
     */
    public getActiveQuest(): { description: string; progress: number; goal: number } | null {
        return this.activeQuest;
    }
}
