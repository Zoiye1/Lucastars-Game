type QuestArray = {
    NPC: string;
    startQuest: boolean;
    completed: boolean;
};

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

    // Voeg de nieuwe activeQuest eigenschap toe
    activeQuest?: {
        name: string;
        item: string;
        completed: boolean;
    };
    pickedUpJumpRope: boolean;
    placedEscapeLadder: boolean;
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
};
