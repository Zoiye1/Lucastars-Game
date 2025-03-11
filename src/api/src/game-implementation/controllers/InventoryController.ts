import { gameService } from "../../global";
import { PlayerSession } from "../types";
import { GameController } from "./GameController";
import { Request, Response } from "express";

export class InventoryController extends GameController {
    public handleGetInventoryRequest(_req: Request, res: Response): void {
        const result: string[] = this.executeGetInventory();
        res.status(200).json({ result });
    }

    private executeGetInventory(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        return playerSession.inventory;
    }
}
