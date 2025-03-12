import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { GameObject } from "../../game-base/gameObjects/GameObject";

/**
 * Interface for objects that can be targets of inventory items
 */
@Interface
export abstract class TargetOf {
    /**
     * Execute the action of using another item on this target
     *
     * @param sourceItem The item being used on this target
     * @returns Result of the action or undefined if not handled
     */
    public abstract useWith(sourceItem: GameObject): ActionResult | undefined;
}

/**
 * Base class for items that can be targets of other items
 */
export abstract class TargetItem extends Item implements TargetOf {
    /**
     * Create a new instance of this target item
     *
     * @param alias Alias of this target item
     */
    protected constructor(alias: string) {
        super(alias);
    }

    /**
     * Handle using an inventory item on this target
     *
     * @param sourceItem The item being used on this target
     * @returns Result of the action or undefined if not handled
     */
    public abstract useWith(sourceItem: GameObject): ActionResult | undefined;
}
