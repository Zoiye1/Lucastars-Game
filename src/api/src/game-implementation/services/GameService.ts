import { BaseGameService } from "../../game-base/services/BaseGameService";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { StartupRoom } from "../rooms/StartupRoom";
import { PlayerSession } from "../types";
import { KitchenRoom } from "../rooms/KitchenRoom";
import { TitleItem } from "../items/TitleItem";
import { cookCharacter } from "../characters/cookCharacter";
import { KnifeItem } from "../items/KnifeItem";
import { SugarItem } from "../items/SugarItem";
import { StorageRoom } from "../rooms/StorageRoom";
import { CafeteriaRoom } from "../rooms/CafeteriaRoom";
import { CourtyardRoom } from "../rooms/CourtyardRoom";
import { FocusDrinkItem } from "../items/FocusDrinkItem";
import { CleanerCharacter } from "../characters/CleanerCharacter";
import { PickUpAction } from "../actions/PickUpAction";

/**
 * Implementation of the game service used to operate the game engine
 */
export class GameService extends BaseGameService<PlayerSession> {
    /**
     * Create a new instance of the game service
     */
    public constructor() {
        super("game");

        // Rooms
        this.registerGameObject(StartupRoom);
        this.registerGameObject(KitchenRoom);
        this.registerGameObject(StorageRoom);

        // Items
        this.registerGameObject(TitleItem);
        this.registerGameObject(KnifeItem);
        this.registerGameObject(SugarItem);

        // Characters
        this.registerGameObject(cookCharacter);
        this.registerGameObject(CafeteriaRoom);
        this.registerGameObject(CourtyardRoom);

        // Items
        this.registerGameObject(FocusDrinkItem);

        // Characters
        this.registerGameObject(CleanerCharacter);

        // Actions
        this.registerAction(PickUpAction);
    }

    /**
     * @inheritdoc
     */
    public createNewPlayerSession(): PlayerSession {
        return {
            currentRoom: StartupRoom.Alias,
            inventory: [],
            GaveTheForkToCook: false,
            ThreatenedCook: false,
            helpedCleaner: false,
            pickedUpFocusDrink: false,
        };
    }

    /**
     * Get the contents of the player inventory as a list of game objects instances
     *
     * @returns List of game object instances. Can be empty when no game objects were found.
     */
    public getGameObjectsFromInventory(): GameObject[] {
        return this.getGameObjectsByAliases(this.getPlayerSession().inventory);
    }
}
