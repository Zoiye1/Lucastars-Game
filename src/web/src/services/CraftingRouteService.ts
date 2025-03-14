import {
    ExecuteDeleteItemsRequest,
    ExecuteRetrieveRequest
} from "@shared/types";
import { GameRouteService } from "./GameRouteService";

/**
 * Service om te communiceren met crafting routes
 */
export class CraftingRouteService extends GameRouteService {
    /**
     * Voer een request uit om een item op te halen voor de speler
     *
     * @param itemAlias Alias van het item dat opgehaald moet worden
     *
     * @returns Een string met de response van de api of undefined als de opdracht mislukt
     */
    public async executeRetrieveItem(
        itemAlias: string
    ): Promise<string | undefined> {
        try {
            return await this.putJsonApi<string, ExecuteRetrieveRequest>("game/retrieve", {
                itemAlias,
            });
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }

    /**
     * Voer een opdracht uit om meerdere items te verwijderen
     *
     * @param deleteItemsAliasArray Array van aliassen van de items die verwijderd moeten worden
     *
     * @returns Een string met de response van de api of undefined als de opdracht mislukt
     */
    public async executeDeleteItem(deleteItemsAliasArray: string[]): Promise<string | undefined> {
        try {
            return await this.deleteJsonApi<string, ExecuteDeleteItemsRequest>("game/retrieve", {
                deleteItemsAliasArray,
            });
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }

    /**
     * Haal het geselecteerde item op voor de speler
     *
     * @returns Een string die het geselecteerde item representeert
     */
    public async getSelectedItem(): Promise<string> {
        return this.getJsonApi<string>("game/inventoryItem");
    }
}
