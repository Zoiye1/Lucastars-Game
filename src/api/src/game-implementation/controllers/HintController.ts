import { gameService } from "../../global";
import { GameController } from "./GameController";
import { Request, Response } from "express";
import { PlayerSession } from "../types";

/**
 * Controller voor het afhandelen van alle hint verzoeken
 */
export class HintController extends GameController {
    /**
     * Verwerkt het verzoek om playerSession op te halen
     *
     * @remarks Response is een 200 met een bevestigingsbericht bij succes
     */
    public handlePlayerSessionRequest(_: Request, res: Response): PlayerSession | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        res.json(playerSession);
        return playerSession;
    }
}
