import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { GameObject } from "../../game-base/gameObjects/GameObject";

/**
 * Action result that shows inventory items to select from
 */
export class ShowInventoryActionResult extends ActionResult {
    /** List of inventory items to display */
    private _inventoryItems: GameObject[];

    /**
     * Create a new instance of this action result
     *
     * @param inventoryItems List of inventory items to display
     */
    public constructor(inventoryItems: GameObject[]) {
        super();
        this._inventoryItems = inventoryItems;
    }

    /**
     * Get the inventory items to display
     */
    public get inventoryItems(): GameObject[] {
        return this._inventoryItems;
    }
}

/**
 * Action result that shows potential target items for a selected inventory item
 */
export class ShowTargetsActionResult extends ActionResult {
    /** The inventory item that was selected */
    private _sourceItem: GameObject;

    /** List of potential target items in the room */
    private _targetItems: GameObject[];

    /**
     * Create a new instance of this action result
     *
     * @param sourceItem The inventory item that was selected
     * @param targetItems List of potential target items in the room
     */
    public constructor(sourceItem: GameObject, targetItems: GameObject[]) {
        super();
        this._sourceItem = sourceItem;
        this._targetItems = targetItems;
    }

    /**
     * Get the inventory item that was selected
     */
    public get sourceItem(): GameObject {
        return this._sourceItem;
    }

    /**
     * Get the potential target items in the room
     */
    public get targetItems(): GameObject[] {
        return this._targetItems;
    }
}
