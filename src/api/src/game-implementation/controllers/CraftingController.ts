import { ExecuteRetrieveRequest, ExecuteDeleteItemsRequest } from "@shared/types";
import { gameService } from "../../global";
import { GameController } from "./GameController";
import { Request, Response } from "express";

export class CraftingController extends GameController {
    public handleRetrieveRequest(req: Request, res: Response): void {
        const executeRetrieveRequest: ExecuteRetrieveRequest = req.body as ExecuteRetrieveRequest;

        const result: string = this.executeRetrieveItem(executeRetrieveRequest.itemAlias);
        res.status(200).json({ message: result });
    }

    public handleDeleteItemsRequest(req: Request, res: Response): void {
        const executeDeleteItemsRequest: ExecuteDeleteItemsRequest = req.body as ExecuteDeleteItemsRequest;

        const result: string = this.executeDeleteItems(executeDeleteItemsRequest.deleteItemsAliasArray);
        res.status(200).json({ message: result });
    }

    private executeRetrieveItem(itemAlias: string): string {
        const inventory: string[] = gameService.getPlayerSession().inventory;
        if (!inventory.includes(itemAlias)) {
            inventory.push(itemAlias);
            return `Item "${itemAlias}" retrieved successfully.`;
        }
        else {
            return "Item already in inventory";
        }
    }

    private executeDeleteItems(itemsToDelete: string[]): string {
        const inventory: string[] = gameService.getPlayerSession().inventory;

        for (const itemAlias of itemsToDelete) {
            if (inventory.includes(itemAlias)) {
                inventory.splice(inventory.indexOf(itemAlias), 1);
            }
        }
        return `Items "${itemsToDelete}" deleted successfully.`;
    }
}
