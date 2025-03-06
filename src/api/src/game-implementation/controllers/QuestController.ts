import { Request, Response } from "express";
import { QuestComponent } from "../../../../web/src/components/QuestComponent";
import { gameService } from "../../global"; // Zorg ervoor dat dit correct wordt geïmporteerd
// import { PlayerSession } from "../types";

export class QuestController {
    /**
     * Start een nieuwe fetch quest.
     */
    public startQuest(req: Request, res: Response): void {
        // Haal de speler-sessie op
        const playerSession = gameService.getPlayerSession();

        if (!playerSession) {
            res.status(400).send("No active player session found!");
            return;
        }

        const { description, goal } = req.body;

        // Valideer de request body
        if (!description || !goal) {
            res.status(400).send("Description and goal are required!");
            return;
        }

        // Koppel de quest aan de speler-sessie
        if (!playerSession.questComponent) {
            playerSession.questComponent = new QuestComponent();
        }

        playerSession.questComponent.startFetchQuest(description, goal);
        res.status(200).send("Fetch quest started!");
    }

    /**
     * Update de voortgang van de huidige quest.
     */
    public updateProgress(req: Request, res: Response): void {
        // Haal de speler-sessie op
        const playerSession = gameService.getPlayerSession();

        if (!playerSession || !playerSession.questComponent) {
            res.status(400).send("No active quest found for this player!");
            return;
        }

        const { amount } = req.body;

        // Valideer de request body
        if (amount === undefined || amount === null) {
            res.status(400).send("Amount is required!");
            return;
        }

        playerSession.questComponent.updateProgress(amount);
        res.status(200).send("Progress updated!");
    }

    /**
     * Haal de actieve quest op.
     */
    public getActiveQuest(_: Request, res: Response): void {
        // Haal de speler-sessie op
        const playerSession = gameService.getPlayerSession();

        if (!playerSession || !playerSession.questComponent) {
            res.status(404).send("No active quest found.");
            return;
        }

        const activeQuest = playerSession.questComponent.getActiveQuest();

        if (!activeQuest) {
            res.status(404).send("No active quest found.");
            return;
        }

        res.status(200).json(activeQuest);
    }
}
