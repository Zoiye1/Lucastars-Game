import { Request, Response } from "express";
import { PlayerSession } from "../types"; // Zorg ervoor dat de PlayerSession goed geïmporteerd is
import { gameService } from "../../global";

export class QuestController {
    /**
     * Haalt de actieve quest van de speler op.
     */
    public getActiveQuest(req: Request, res: Response): void {
        const playerSession: PlayerSession = gameService.getPlayerSession(req);

        if (playerSession.activeQuest) {
            res.json(playerSession.activeQuest);
        }
        else {
            res.status(404).json({ message: "No active quest." });
        }
    }

    /**
     * Start een nieuwe fetch quest.
     */
    public startQuest(req: Request, res: Response): void {
        const playerSession: PlayerSession = gameService.getPlayerSession(req);

        // Start een fetch quest voor de speler
        playerSession.activeQuest = {
            name: "Find powdered sugar",
            item: "SugarItem",
            completed: false,
        };

        res.json({ message: "Quest started!", quest: playerSession.activeQuest });
    }
    // test

    /**
     * Voltooi een fetch quest als het item is gevonden.
     */
    public completeQuest(req: Request, res: Response): void {
        const playerSession: PlayerSession = gameService.getPlayerSession(req);

        if (playerSession.activeQuest && playerSession.inventory.includes(playerSession.activeQuest.item)) {
            playerSession.activeQuest.completed = true;
            playerSession.inventory.push("Steroids"); // Beloning voor de quest
            res.json({ message: "Quest completed! Here's your reward.", inventory: playerSession.inventory });
        }
        else {
            res.status(400).json({ message: "You don't have the required item to complete the quest." });
        }
    }
}
