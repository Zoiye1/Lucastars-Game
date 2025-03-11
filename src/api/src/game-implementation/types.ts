export type PlayerSession = {
    playerOpenedDoorToStorage: boolean;
    pickedUpSugar: boolean;
    pickedUpKey: boolean;
    /** Alias of the room the player is in */
    currentRoom: string;
    /** List of game object aliases the player owns */
    inventory: string[];
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
    pickedUpJumpRope: boolean;
    retrievedTenSticks: boolean;
    placedEscapeLadder: boolean;
    tradedWithSmoker: boolean;
    ventUnlocked: boolean;
    windowBroken: boolean;
    wantsToSearchGlassBeaker: boolean;
    wantsToSearchIngredients: boolean;
    pickedUpBakingSoda: boolean;
    helpedProfessor: boolean;
    pickedUpSheets: boolean;
    pickedUpAirFreshener: boolean;
    
};
