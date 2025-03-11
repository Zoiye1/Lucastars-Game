import { ExecuteActionRequest, GameState } from "@shared/types";
import { BaseRouteService } from "./BaseRouteService";

/**
 * Service to communicate with game routes of the server application
 */
export class GameRouteService extends BaseRouteService {
    /**
     * Get a type of game state for the current player from the server application
     *
     * @returns A type of game state for the current player
     */
    public async getGameState(): Promise<GameState> {
        return this.getJsonApi<GameState>("game/state");
    }

    /**
     * Execute an action for the current player on the server application
     *
     * @param actionAlias Alias of the action to execute
     * @param objectAliases Aliases of the game objects to execute the action on
     *
     * @returns A type of game state, or `undefined` if the action was unhandled. This can indicate the action requires a second game object to work.
     */
    public async executeAction(
        actionAlias: string,
        objectAliases?: string[]
    ): Promise<GameState | undefined> {
        try {
            return await this.postJsonApi<GameState, ExecuteActionRequest>("game/action", {
                action: actionAlias,
                objects: objectAliases,
            });
        }
        catch {
            return undefined;
        }
    }

    public async executeMoveAction(
        actionAlias: string,
        objectAliases?: string[]
    ): Promise<GameState | undefined> {
        try {
            return await this.postJsonApi<GameState, ExecuteActionRequest>("game/action", {
                action: actionAlias,
                objects: objectAliases,
            });
        }
        catch {
            return undefined;
        }
    }

    public async getInventory(): Promise<string[] | undefined> {
        return this.getJsonApi<string[] | undefined>("game/inventory");
    }

    public async executeSelectItem(itemAlias: string): Promise<string | undefined> {
        try {
            return await this.putJsonApi<string, { itemAlias: string }>("game/inventory", {
                itemAlias,
            });
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }
}
