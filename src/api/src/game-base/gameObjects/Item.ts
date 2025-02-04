import { GameObject } from "./GameObject";

/**
 * Base class used to represent an item
 */
export abstract class Item extends GameObject {
    /**
     * Create a new instance of this item
     *
     * @param alias Alias of this item
     */
    protected constructor(alias: string) {
        super(alias);
    }
}
