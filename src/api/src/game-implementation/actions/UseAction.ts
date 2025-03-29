import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Action } from "../../game-base/actions/Action";
import { gameService } from "../../global";
import { ShowInventoryActionResult, ShowTargetsActionResult } from "../actionResults/InventoryActionResult";
import { TargetOf } from "../../game-base/gameObjects/TargetItem";
import { Room } from "../../game-base/gameObjects/Room";

/**
 * Klasse die de "Use"-actie vertegenwoordigt.
 */
export class UseAction extends Action {
    /**
     * Alias die wordt gebruikt om deze actie te identificeren.
     */
    public static readonly Alias: string = "use";

    /**
     * Prefix for the alias when selecting an inventory item
     */
    public static readonly SelectInventoryPrefix: string = "use:inventory:";

    /**
     * Prefix for the alias when using an inventory item on a target
     */
    public static readonly UseWithPrefix: string = "use:with:";

    /**
     * Maakt een nieuwe instantie van de UseAction.
     */
    public constructor() {
        super(UseAction.Alias, false);
    }

    /**
     * Geeft de naam van de actie terug.
     * @returns {string} De naam van de actie.
     */
    public name(): string {
        return "Use";
    }

    /**
     * Voert de "Use"-actie uit
     * @param {string} alias - De alias van de actie.
     * @param {GameObject[]} _gameObjects - De lijst van game-objecten waarop de actie wordt uitgevoerd.
     * @returns {ActionResult | undefined} Het resultaat van de actie.
     */
    public execute(alias: string, _gameObjects: GameObject[]): ActionResult | undefined {
        // Case 1: Initial "Use" action selected (show inventory)
        if (alias === UseAction.Alias) {
            const inventoryItems: GameObject[] = gameService.getGameObjectsFromInventory();
            if (inventoryItems.length === 0) {
                return new TextActionResult(["You don't have anything to use."]);
            }
            return new ShowInventoryActionResult(inventoryItems);
        }

        // Case 2: Player selected an inventory item (show targets)
        if (alias.startsWith(UseAction.SelectInventoryPrefix)) {
            const inventoryItemAlias: string = alias.substring(UseAction.SelectInventoryPrefix.length);
            const inventoryItem: GameObject | undefined = gameService.getGameObjectByAlias(inventoryItemAlias);

            if (!inventoryItem) {
                return new TextActionResult(["Item not found."]);
            }

            // Get the current room
            const roomAlias: string = gameService.getPlayerSession().currentRoom;
            const room: Room | undefined = gameService.getGameObjectByAlias(roomAlias) as Room;

            if (!room) {
                return new TextActionResult(["Room not found."]);
            }

            // Get objects in the room that can be targets
            const roomObjectsPromise = room.objects();

            // Handle async or sync return from room.objects()
            const handleRoomObjects = (roomObjects: GameObject[]): ActionResult => {
                const targetObjects = roomObjects.filter((obj: GameObject): boolean => {
                    return obj.instanceOf(TargetOf) ?? false;
                });

                if (targetObjects.length === 0) {
                    return new TextActionResult(["There's nothing here to use that item on."]);
                }

                return new ShowTargetsActionResult(inventoryItem, targetObjects);
            };

            // Check if we have a promise or direct array
            if (roomObjectsPromise instanceof Promise) {
                // We'll need to handle this asynchronously - returning a promise
                // This might require changes in the ActionResult system to handle promises
                // For now, let's assume we need to handle this synchronously
                return new TextActionResult(["Unable to get room objects."]);
            }
            else {
                return handleRoomObjects(roomObjectsPromise);
            }
        }

        // Case 3: Player selected a target for the inventory item
        if (alias.startsWith(UseAction.UseWithPrefix)) {
            const parts: string[] = alias.substring(UseAction.UseWithPrefix.length).split(":");
            const sourceAlias: string = parts[0];
            const targetAlias: string = parts[1];

            const sourceItem: GameObject | undefined = gameService.getGameObjectByAlias(sourceAlias);
            const targetItem: GameObject | undefined = gameService.getGameObjectByAlias(targetAlias);

            if (!sourceItem || !targetItem) {
                return new TextActionResult(["Item not found."]);
            }

            if (targetItem.instanceOf(TargetOf)) {
                return targetItem.useWith(sourceItem);
            }

            return new TextActionResult(["You can't use that item on that."]);
        }

        return new TextActionResult(["That doesn't make any sense."]);
    }
}
