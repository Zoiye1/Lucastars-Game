import { ExecuteSelectItemRequest } from "@shared/types";
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

    public handleSelectedItemInventory(req: Request, res: Response): void {
        const executeSelectItemRequest: ExecuteSelectItemRequest = req.body as ExecuteSelectItemRequest;

        const result: string = this.executeSelectItem(executeSelectItemRequest.itemAlias);
        res.status(200).json({ message: result });
    }

    private executeSelectItem(itemAlias: string): string {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        playerSession.selectedItemInventory = itemAlias;

        return itemAlias;
    }
}
