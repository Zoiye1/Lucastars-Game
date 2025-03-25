import { ActionReference, ExecuteActionRequest, GameObjectReference, GameState } from "@shared/types";
import { Request, Response } from "express";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { SwitchPageActionResult } from "../actionResults/SwitchPageActionResult";
import { Action } from "../../game-base/actions/Action";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { PlayerSession } from "../types";
import { ShowInventoryActionResult, ShowTargetsActionResult } from "../actionResults/InventoryActionResult";
import { UseAction } from "../actions/UseAction";

/**
 * Controller to handle all game related requests
 */

type QuestArray = {
    NPC: string;
    startQuest: boolean;
    completed: boolean;
    description: string;
};

export class GameController {
    /**
     * Handle the request to retrieve the game state for the current player
     *
     * @remarks Response is a 200 with a `GameState` on success, otherwise a 500.
     */
    public async handleStateRequest(_: Request, res: Response): Promise<void> {
        // Execute the Examine action on the current room
        const gameState: GameState | undefined = await this.executeAction(ExamineAction.Alias);

        if (gameState) {
            res.json(gameState);
        }
        else {
            res.status(500).end();
        }
    }

    /**
     * Handle the request to execute an action for the current player
     *
     * @remarks Response is a 200 with a `GameState` on success, otherwise a 500.
     */
    public async handleActionRequest(req: Request, res: Response): Promise<void> {
        // Extract the data from the request body
        const executeActionRequest: ExecuteActionRequest = req.body as ExecuteActionRequest;

        // Execute the requested action on the requested game objects
        const gameState: GameState | undefined = await this.executeAction(
            executeActionRequest.action,
            executeActionRequest.objects
        );

        if (gameState) {
            res.json(gameState);
        }
        else {
            res.status(500).end();
        }
    }

    /**
     * Execute the requested action and convert the result to a type of `GameState`.
     *
     * @param actionAlias Alias of action to execute
     * @param gameObjectAliases Optional list of game object aliases to execute the action on
     *
     * @returns A type of `GameState` representing the result of the action or `undefined` when something went wrong.
     */
    protected async executeAction(actionAlias: string, gameObjectAliases?: string[]): Promise<GameState | undefined> {
        // If no game object aliases are defined, use the current room instead.
        console.log(actionAlias);
        if (!gameObjectAliases || gameObjectAliases.length === 0) {
            gameObjectAliases = [gameService.getPlayerSession().currentRoom];
        }

        console.log(gameObjectAliases);

        // Get the game objects for the aliases
        const gameObjects: GameObject[] = gameService.getGameObjectsByAliases(gameObjectAliases);

        // If no game objects are found, this request is invalid.
        if (gameObjects.length === 0) {
            console.error("[error][GameController::executeAction] No game objects found!");

            return undefined;
        }

        // Let the game engine execute the action. It's important to use "await" here, since some actions might be asynchronous!
        const actionResult: ActionResult | undefined = await gameService.executeAction(
            actionAlias,
            gameObjects
        );

        // Convert the result of the action to the new game state
        return this.convertActionResultToGameState(actionResult);
    }

    /**
     * Convert the result of an action to a type of `GameState`.
     *
     * @param actionResult Result of an action, can be `undefined`.
     *
     * @returns A type of `GameState` representing the result of the action or `undefined` when something went wrong.
     */
    private async convertActionResultToGameState(actionResult?: ActionResult): Promise<GameState | undefined> {
        // Handle ShowInventoryActionResult to show inventory items
        if (actionResult instanceof ShowInventoryActionResult) {
            const inventoryItems = actionResult.inventoryItems;
            const inventoryReferences: GameObjectReference[] = [];

            for (const item of inventoryItems) {
                inventoryReferences.push(await this.convertGameObjectToReference(item));
            }

            // Create actions for each inventory item
            const actions: ActionReference[] = [];
            for (const itemRef of inventoryReferences) {
                actions.push({
                    alias: `${UseAction.SelectInventoryPrefix}${itemRef.alias}`,
                    name: `Use ${itemRef.name}`,
                    needsObject: false,
                });
            }

            return {
                type: "inventory-selection",
                text: ["Select an item to use:"],
                objects: inventoryReferences,
                actions: actions,
                roomAlias: gameService.getPlayerSession().currentRoom,
                roomName: "Inventory Selection",
                roomImages: [],
            };
        }

        // Handle ShowTargetsActionResult to show target items in the room
        if (actionResult instanceof ShowTargetsActionResult) {
            const sourceItem = actionResult.sourceItem;
            const targetItems = actionResult.targetItems;

            const sourceRef = await this.convertGameObjectToReference(sourceItem);
            const targetRefs: GameObjectReference[] = [];

            for (const item of targetItems) {
                targetRefs.push(await this.convertGameObjectToReference(item));
            }

            // Create actions for each target item
            const actions: ActionReference[] = [];
            for (const targetRef of targetRefs) {
                actions.push({
                    alias: `${UseAction.UseWithPrefix}${sourceItem.alias}:${targetRef.alias}`,
                    name: `Use on ${targetRef.name}`,
                    needsObject: false,
                });
            }

            return {
                type: "target-selection",
                text: [`Select where to use the ${await sourceItem.name()}:`],
                objects: targetRefs,
                actions: actions,
                roomAlias: gameService.getPlayerSession().currentRoom,
                roomName: "Target Selection",
                roomImages: [],
            };
        }

        // If the client application has to switch pages, handle it now.
        if (actionResult instanceof SwitchPageActionResult) {
            return {
                type: "switch-page",
                page: actionResult.page,
            };
        }

        // The room can have changed after executing an action, so we have to retrieve the player session again!
        const room: Room | undefined = gameService.getGameObjectByAlias(
            gameService.getPlayerSession().currentRoom
        ) as Room | undefined;

        // If no current room is found, this request is invalid.
        if (!room) {
            console.error("[error][GameController::convertActionResultToGameState] No current room found!");

            return undefined;
        }

        // Determine the text to show to the player
        let text: string[];

        if (actionResult instanceof TextActionResult) {
            text = actionResult.text;
        }
        else {
            text = ["That doesn't make any sense."];
        }

        // Determine the actions to show to the player
        let actions: ActionReference[];

        if (actionResult instanceof TalkActionResult) {
            actions = actionResult.choices.map((e) => this.convertTalkChoiceToReference(actionResult, e));
        }
        else {
            actions = [];

            for (const action of await room.actions()) {
                actions.push(await this.convertActionToReference(action));
            }
        }

        // Determine the game objects to show to the player
        const objects: GameObjectReference[] = [];

        for (const object of await room.objects()) {
            objects.push(await this.convertGameObjectToReference(object));
        }

        // Combine all data into a game state
        return {
            type: "default",
            roomAlias: room.alias,
            roomName: await room.name(),
            roomImages: await room.images(),
            roomArrowImages: room.ArrowUrl(),
            roomClickImages: room.ClickItem(),
            text: text,
            actions: actions,
            objects: objects,
        };
    }

    /**
     * Convert a talk choice into an action reference for the client application
     *
     * @param action Action instance to convert
     * @param choice Choice instance to convert
     *
     * @returns Action reference for the client application
     */
    private convertTalkChoiceToReference(action: TalkActionResult, choice: TalkChoice): ActionReference {
        return {
            alias: choice.toAlias(action.character),
            name: choice.text,
            needsObject: false,
        };
    }

    /**
     * Convert an action instance into an action reference for the client application
     *
     * @param action Action instance to convert
     *
     * @returns Action reference for the client application
     */
    private async convertActionToReference(action: Action): Promise<ActionReference> {
        return {
            alias: action.alias,
            name: await action.name(),
            needsObject: action.needsObject,
        };
    }

    /**
     * Convert a game object instance into a game object reference for the client application
     *
     * @param gameObject Game object instance to convert
     *
     * @returns Game object reference for the client application
     */
    private async convertGameObjectToReference(gameObject: GameObject): Promise<GameObjectReference> {
        return {
            alias: gameObject.alias,
            name: await gameObject.name(),
            type: await gameObject.type(),
        };
    }

    // Voeg de nieuwe methoden toe
    public getActiveQuests(_: Request, res: Response): QuestArray[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const questArray: QuestArray[] = [
            {
                NPC: "dealer",
                startQuest: !!playerSession.wantsToHelpDealer,
                completed: !!playerSession.helpedDealer,
                description: "Find the Sugar & talk to the dealer",
            },
            {
                NPC: "cleaner",
                startQuest: playerSession.wantsToHelpCleaner,
                completed: playerSession.helpedCleaner,
                description: "Search the waterbucket and help the cleaner",
            },
            {
                NPC: "cook",
                startQuest: !!playerSession.wantsToHelpCook,
                completed: !!playerSession.helpedCook,
                description: "Find the fork or find another way to get the key from the cook",
            },
            {
                NPC: "gymfreak",
                startQuest: !!playerSession.wantsToHelpGymFreak,
                completed: playerSession.helpedGymFreak,
                description: "Find a way to give some steriods to the gymfreak",
            },
            {
                NPC: "professor",
                startQuest: !!playerSession.wantsToHelpProfessor,
                completed: playerSession.helpedProfessor,
                description: "Bring the required ingredients to the professor",
            },
            {
                NPC: "smoker",
                startQuest: !!playerSession.wantsToHelpSmoker,
                completed: !!playerSession.helpedSmoker,
                description: "Get the sigarettes",
            },
        ];
        res.json(questArray);
        return questArray;
    }
}
