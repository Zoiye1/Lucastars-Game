import { ExecuteRetrieveRequest, ExecuteDeleteItemsRequest } from "@shared/types";
import { gameService } from "../../global";
import { GameController } from "./GameController";
import { Request, Response } from "express";

/**
 * Controller voor het afhandelen van alle crafting verzoeken
 */
export class CraftingController extends GameController {
    /**
     * Verwerkt het verzoek om een item op te halen voor de speler
     *
     * @remarks Response is een 200 met een bevestigingsbericht bij succes
     */
    public handleRetrieveRequest(req: Request, res: Response): void {
        const executeRetrieveRequest: ExecuteRetrieveRequest = req.body as ExecuteRetrieveRequest;

        const result: string = this.executeRetrieveItem(executeRetrieveRequest.itemAlias);
        res.status(200).json({ message: result });
    }

    /**
     * Verwerkt het verzoek om items te verwijderen voor de speler
     *
     * @remarks Response is een 200 met een bevestigingsbericht bij succes
     */
    public handleDeleteItemsRequest(req: Request, res: Response): void {
        const executeDeleteItemsRequest: ExecuteDeleteItemsRequest = req.body as ExecuteDeleteItemsRequest;

        const result: string = this.executeDeleteItems(executeDeleteItemsRequest.deleteItemsAliasArray);
        res.status(200).json({ message: result });
    }

    /**
     * Voert de actie uit om een item op te halen en toe te voegen aan de inventory
     *
     * @param itemAlias Alias van het item dat moet worden opgehaald
     *
     * @returns Een bevestigingsbericht dat aangeeft of de actie succesvol was
     */
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

    /**
     * Voert de actie uit om items te verwijderen uit de inventory
     *
     * @param itemsToDelete Array van item aliases die moeten worden verwijderd
     *
     * @returns Een bevestigingsbericht dat aangeeft of de actie succesvol was
     */
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
