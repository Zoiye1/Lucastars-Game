export type PlayerSession = {
    playerOpenedDoorToStorage: boolean;
    pickedUpSugar: boolean;
    pickedUpKey: boolean;
    /** Alias of the room the player is in */
    currentRoom: string;
    /** List of game object aliases the player owns */
    inventory: string[];
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
    ventUnlocked: boolean;
    windowBroken: boolean;
};
