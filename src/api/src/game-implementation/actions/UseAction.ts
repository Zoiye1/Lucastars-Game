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
     * Prefix voor de alias wanneer je een item selecteerd.
     */
    public static readonly SelectInventoryPrefix: string = "use:inventory:";

    /**
     * Prefix voor de alias wanneer je een item gebruikt op een target.
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
        // Case 1: Use action geselecteerd, laat inventory zien.
        if (alias === UseAction.Alias) {
            const inventoryItems: GameObject[] = gameService.getGameObjectsFromInventory();
            if (inventoryItems.length === 0) {
                return new TextActionResult(["You don't have anything to use, try looking around the room..."]);
            }
            return new ShowInventoryActionResult(inventoryItems);
        }

        // Case 2: Speler heeft een item geselecteerd, laat targetitems zien.
        if (alias.startsWith(UseAction.SelectInventoryPrefix)) {
            const inventoryItemAlias: string = alias.substring(UseAction.SelectInventoryPrefix.length);
            const inventoryItem: GameObject | undefined = gameService.getGameObjectByAlias(inventoryItemAlias);

            if (!inventoryItem) {
                return new TextActionResult(["Item not found."]);
            }

            // Verkrijg de huidige kamer.
            const roomAlias: string = gameService.getPlayerSession().currentRoom;
            const room: Room | undefined = gameService.getGameObjectByAlias(roomAlias) as Room;

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!room) {
                return new TextActionResult(["Room not found."]);
            }

            // Verkrijg target items in room
            // eslint-disable-next-line @typescript-eslint/typedef
            const roomObjectsPromise = room.objects();

            // eslint-disable-next-line @typescript-eslint/typedef
            const handleRoomObjects = (roomObjects: GameObject[]): ActionResult => {
                // eslint-disable-next-line @typescript-eslint/typedef
                const targetObjects = roomObjects.filter((obj: GameObject): boolean => {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    return obj.instanceOf(TargetOf) ?? false;
                });

                if (targetObjects.length === 0) {
                    return new TextActionResult(["There's nothing here to use that item on."]);
                }

                return new ShowTargetsActionResult(inventoryItem, targetObjects);
            };

            if (roomObjectsPromise instanceof Promise) {
                return new TextActionResult(["Unable to get room objects."]);
            }
            else {
                return handleRoomObjects(roomObjectsPromise);
            }
        }

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
