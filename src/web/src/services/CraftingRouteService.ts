import {
    ExecuteDeleteItemsRequest,
    ExecuteRetrieveRequest
} from "@shared/types";
import { GameRouteService } from "./GameRouteService";

/**
 * Service to communicate with game routes of the server application
 */
export class CraftingRouteService extends GameRouteService {
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

    public async getSelectedItem(): Promise<string> {
        return this.getJsonApi<string>("game/inventoryItem");
    }
}
