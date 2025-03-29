import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { TargetItem } from "../../game-base/gameObjects/TargetItem";

/**
 * Type definition for items that can break the window
 */
type BreakableItemAlias = "PaintingItem" | "HammerItem";

/**
 * Record type for storing messages by item type
 */
type MessagesByItem = Record<BreakableItemAlias, string[]>;

/**
 * Represents a window item in the game that can be broken with certain objects
 */
export class WindowItem extends TargetItem implements Examine {
    /**
     * The unique alias for window items
     */
    public static readonly Alias: string = "WindowItem";

    /**
     * Creates a new window item
     */
    public constructor() {
        super(WindowItem.Alias);
    }

    /**
     * Gets the display name of the window
     * @returns {string} The name of the window
     */
    public name(): string {
        return "Window";
    }

    /**
     * Gets the types associated with this game object
     * @returns {GameObjectType[]} Array of types
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    /**
     * Handles examining the window
     * @returns {ActionResult} The result of examining the window
     */
    public examine(): ActionResult {
        return new TextActionResult(["A window leading to the hallway. It's locked."]);
    }

    /**
     * Handles using an item with the window
     * @param {GameObject} sourceItem - The item being used on the window
     * @returns {ActionResult | undefined} The result of using the item, or undefined if not applicable
     */
    public useWith(sourceItem: GameObject): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const windowBreakingItems: BreakableItemAlias[] = ["PaintingItem", "HammerItem"];

        // Handle the fork case separately, before checking breaking items
        if (sourceItem.alias === "ForkItem") {
            return new TextActionResult([
                "You stab the fork against the window! nothing happens...",
                "What were you thinking?",
            ]);
        }

        // Check if using a breaking item on the window
        if (windowBreakingItems.includes(sourceItem.alias as BreakableItemAlias)) {
            playerSession.windowBroken = true;

            const messages: MessagesByItem = {
                PaintingItem: [
                    "You throw the painting at the window, shattering it!",
                    "You can now enter the hallway.",
                ],
                HammerItem: [
                    "You bash the hammer against the window, smashing it completely!",
                    "You can now enter the hallway.",
                ],
            };

            const itemAlias: BreakableItemAlias = sourceItem.alias as BreakableItemAlias;
            const messageForItem: string[] = messages[itemAlias];

            return new TextActionResult(messageForItem);
        }

        return undefined;
    }
}
