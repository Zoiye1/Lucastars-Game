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
     * @param {GameObject[]} gameObjects - De lijst van game-objecten waarop de actie wordt uitgevoerd.
     * @returns {ActionResult | undefined} Het resultaat van de actie.
     */
    public execute(alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        // Case 1: Initial "Use" action selected (show inventory)
        if (alias === UseAction.Alias) {
            const inventoryItems = gameService.getGameObjectsFromInventory();
            if (inventoryItems.length === 0) {
                return new TextActionResult(["You don't have anything to use."]);
            }
            return new ShowInventoryActionResult(inventoryItems);
        }

        // Case 2: Player selected an inventory item (show targets)
        if (alias.startsWith(UseAction.SelectInventoryPrefix)) {
            const inventoryItemAlias = alias.substring(UseAction.SelectInventoryPrefix.length);
            const inventoryItem = gameService.getGameObjectByAlias(inventoryItemAlias);

            if (!inventoryItem) {
                return new TextActionResult(["Item not found."]);
            }

            // Get the current room
            const roomAlias = gameService.getPlayerSession().currentRoom;
            const room = gameService.getGameObjectByAlias(roomAlias) as Room;

            if (!room) {
                return new TextActionResult(["Something went wrong."]);
            }

            // Get objects in the room that can be targets
            const roomObjects = room.objects().filter(obj => obj.instanceOf && obj.instanceOf(TargetOf));

            if (roomObjects.length === 0) {
                return new TextActionResult(["There's nothing here to use that item on."]);
            }

            return new ShowTargetsActionResult(inventoryItem, roomObjects);
        }

        // Case 3: Player selected a target for the inventory item
        if (alias.startsWith(UseAction.UseWithPrefix)) {
            const parts = alias.substring(UseAction.UseWithPrefix.length).split(":");
            const sourceAlias = parts[0];
            const targetAlias = parts[1];

            const sourceItem = gameService.getGameObjectByAlias(sourceAlias);
            const targetItem = gameService.getGameObjectByAlias(targetAlias);

            if (!sourceItem || !targetItem) {
                return new TextActionResult(["Item not found."]);
            }

            if (targetItem.instanceOf && targetItem.instanceOf(TargetOf)) {
                return targetItem.useWith(sourceItem);
            }

            return new TextActionResult(["You can't use that item on that."]);
        }

        return new TextActionResult(["That doesn't make any sense."]);
    }
}
