import { ExecuteActionRequest, ExecuteDeleteItemsRequest, ExecuteRetrieveRequest, GameState, ExecuteQuestStartRequest } from "@shared/types";
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

    public async executeDeleteItem(
        deleteItemsAliasArray: string[]
    ): Promise<string | undefined> {
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

    public async executeQuestStart(
        questAlias: string
    ): Promise<string | undefined> {
        try {
            return await this.postJsonApi<string, ExecuteQuestStartRequest>("game/start", {
                questAlias,
            });
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public async executeQuestActive(): Promise<string | undefined> {
        try {
            return await this.getJsonApi<string>("game/active");
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public async completeQuest(questAlias: string): Promise<boolean> {
        try {
            return await this.postJsonApi<boolean, ExecuteQuestStartRequest>("game/complete", {
                questAlias,
            });
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
}
