
/**
 * Represents all data that should be stored for a player
 *
 * @remarks Can only contain JSON data types
 */
export type PlayerSession = {
    /** Alias of the room the player is in */
    currentRoom: string;
    /** List of game object aliases the player owns */
    inventory: string[];
    GaveTheForkToCook: boolean;
    ThreatenedCook: boolean;
    helpedCleaner: boolean;
    pickedUpFocusDrink: boolean;
    pickedUpFork: boolean;
    pickedUpPainting: boolean;

    pickedUpBucket: boolean;
};
