type QuestArray = {
    NPC: string;
    startQuest: boolean;
    completed: boolean;
};

/**
 * Type definitions shared between client and server
 */

/**
 * Reference to an arrow that can be clicked to navigate between rooms
 */
export type ArrowRoom = {
    ImageLocation: string;
    OnClickEvent: string;
};

/**
 * Reference to a game object for the client application
 */
export type GameObjectReference = {
    /** Alias of the game object */
    alias: string;
    /** Name of the game object */
    name: string;
    /** Type(s) of the game object */
    type: string[];
};

/**
 * Reference to an action for the client application
 */
export type ActionReference = {
    /** Alias of the action */
    alias: string;
    /** Name of the action */
    name: string;
    /** Set to true if this action requires another GameObject to work, otherwise false */
    needsObject: boolean;
};

/**
 * Game state for the client application
 */
export type GameState = DefaultGameState | SwitchPageGameState | InventorySelectionGameState | TargetSelectionGameState;

/**
 * Default game state for the client application
 */
export type DefaultGameState = {
    /** Type of game state */
    type: "default";
    /** Alias of the current room */
    roomAlias: string;
    /** Name of the current room */
    roomName: string;
    /** Images used to graphically represent the current room */
    roomImages: string[];
    /** Arrows for navigation in the current room */
    roomArrows: ArrowRoom[];
    /** Text to show to the player */
    text: string[];
    /** Actions available to the player */
    actions: ActionReference[];
    /** Game objects visible to the player */
    objects: GameObjectReference[];
};

/**
 * Switch page game state for the client application
 */
export type SwitchPageGameState = {
    /** Type of game state */
    type: "switch-page";
    /** Alias of the page to switch to */
    page: string;
};

/**
 * Inventory selection game state for the client application
 * Shows player's inventory items that can be used
 */
export type InventorySelectionGameState = {
    /** Type of game state */
    type: "inventory-selection";
    /** Alias of the current room */
    roomAlias: string;
    /** Name of the current room */
    roomName: string;
    /** Images used to graphically represent the current room */
    roomImages: string[];
    /** Optional arrows for navigation */
    roomArrows?: ArrowRoom[];
    /** Text to show to the player */
    text: string[];
    /** Actions available to the player (inventory items to use) */
    actions: ActionReference[];
    /** Game objects visible to the player (inventory items) */
    objects: GameObjectReference[];
};

/**
 * Target selection game state for the client application
 * Shows objects in the room that can be targets for a selected inventory item
 */
export type TargetSelectionGameState = {
    /** Type of game state */
    type: "target-selection";
    /** Alias of the current room */
    roomAlias: string;
    /** Name of the current room */
    roomName: string;
    /** Images used to graphically represent the current room */
    roomImages: string[];
    /** Optional arrows for navigation */
    roomArrows?: ArrowRoom[];
    /** Text to show to the player */
    text: string[];
    /** Actions available to the player (targets to use the item on) */
    actions: ActionReference[];
    /** Game objects visible to the player (potential targets) */
    objects: GameObjectReference[];
};

/**
 * Request body for executing an action
 */
export type ExecuteActionRequest = {
    /** Alias of the action to execute */
    action: string;
    /** List of game object aliases to execute the action on */
    objects?: string[];
};

/**
 * Request body for retrieving an item
 */
export type ExecuteRetrieveRequest = {
    /** Alias of the item to retrieve */
    itemAlias: string;
};

/**
 * Request body for deleting items
 */
export type ExecuteDeleteItemsRequest = {
    /** List of item aliases to delete */
    deleteItemsAliasArray: string[];
};

/**
 * Player session data for the game
 */
export type PlayerSession = {
    playerOpenedElevator: boolean;
    pickedUpGlue: boolean;
    pickedUpWirecutter: boolean;
    pickedUpKeyCard: boolean;
    playerOpenedCloset: boolean;
    playerOpenedDoorToStorage: boolean;
    wardrobeOpened: boolean;
    playerOpenedSteelbox: boolean;
    pickedUpSugar: boolean;
    pickedUpKey: boolean;
    /** Alias of the room the player is in */
    currentRoom: string;
    /** List of game object aliases the player owns */
    inventory: string[];
    selectedItemInventory: string;
    /** All booleans that determine game state */
    GaveTheForkToCook: boolean;
    ThreatenedCook: boolean;
    wantsToHelpCleaner: boolean;
    helpedCleaner: boolean;
    pickedUpFocusDrink: boolean;
    pickedUpHammer: boolean;
    pickedupSticks: boolean;
    pickedUpFork: boolean;
    pickedUpPainting: boolean;
    pickedUpKnife: boolean;
    helpedGymFreak: boolean;
    pickedUpBucket: boolean;
    pickedUpGlassBeaker: boolean;
    pickedUpSulfuricAcid: boolean;
    EscapedLab: boolean;
    HasVisitedStarterRoom: boolean;

    // Voeg de nieuwe activeQuest eigenschap toe
    activeQuest?: {
        name: string;
        item: string;
        completed: boolean;
    };
    pickedUpJumpRope: boolean;
    retrievedTenSticks: boolean;
    placedEscapeLadder: boolean;
    placedBomb: boolean;
    tradedWithSmoker: boolean;
    ventUnlocked: boolean;
    windowBroken: boolean;
    wantsToSearchGlassBeaker: boolean;
    wantsToSearchIngredients: boolean;
    wantsToHelpDealer: boolean;
    wantsToHelpProfessor: boolean;
    wantsToHelpGymFreak: boolean;
    wantsToHelpSmoker: boolean;
    wantsToHelpCook: boolean;
    pickedUpBakingSoda: boolean;
    helpedProfessor: boolean;
    questArray: QuestArray[];
    helpedDealer: boolean;
    helpedSmoker: boolean;
    helpedCook: boolean;
    pickedUpSheets: boolean;
    pickedUpAirFreshener: boolean;
    EscapedRoof: boolean;
};
