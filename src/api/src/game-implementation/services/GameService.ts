import { BaseGameService } from "../../game-base/services/BaseGameService";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { StartupRoom } from "../rooms/StartupRoom";
import { PlayerSession } from "../types";
import { Toilet } from "../rooms/Toilet";
import { KitchenRoom } from "../rooms/KitchenRoom";
import { TitleItem } from "../items/TitleItem";
import { cookCharacter } from "../characters/cookCharacter";
import { KnifeItem } from "../items/KnifeItem";
import { SugarItem } from "../items/SugarItem";
import { StorageRoom } from "../rooms/StorageRoom";
import { StarterRoom } from "../rooms/StarterRoom";
import { CafeteriaRoom } from "../rooms/CafeteriaRoom";
import { CourtyardRoom } from "../rooms/CourtyardRoom";
import { FocusDrinkItem } from "../items/FocusDrinkItem";
import { CleanerCharacter } from "../characters/CleanerCharacter";
import { OpenAction } from "../../game-base/actions/OpenAction";
import { DoorKitchenItem } from "../items/DoorKitchenItem";
import { ClosetStorageItem } from "../items/ClosetStorageItem";
import { BoxStorageItem } from "../items/BoxStorageItem";
import { ElevatorStorageItem } from "../items/ElevatorStorageItem";
import { KeypadStorageItem } from "../items/KeypadStorageItem";
import { PickUpAction } from "../actions/PickUpAction";
import { ForkItem } from "../items/ForkItem";
import { HallwayRoom } from "../rooms/HallwayRoom";
import { StrangerRoom } from "../rooms/Strangerroom";
import { PaintingItem } from "../items/PaintingItem";
import { BucketItem } from "../items/BucketItem";
import { DealerCharacter } from "../characters/DealerCharacters";

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
        this.registerGameObject(Toilet);
        this.registerGameObject(KitchenRoom);
        this.registerGameObject(StorageRoom);
        this.registerGameObject(StarterRoom);
        this.registerGameObject(HallwayRoom);
        this.registerGameObject(StrangerRoom);

        // Items
        this.registerGameObject(TitleItem);
        this.registerGameObject(KnifeItem);
        this.registerGameObject(SugarItem);
        this.registerGameObject(DoorKitchenItem);
        this.registerGameObject(ClosetStorageItem);
        this.registerGameObject(BoxStorageItem);
        this.registerGameObject(ElevatorStorageItem);
        this.registerGameObject(KeypadStorageItem);
        this.registerGameObject(ForkItem);
        this.registerGameObject(PaintingItem);

        // Characters
        this.registerGameObject(cookCharacter);
        this.registerGameObject(CafeteriaRoom);
        this.registerGameObject(CourtyardRoom);

        // Items
        this.registerGameObject(FocusDrinkItem);
        this.registerGameObject(BucketItem);

        // Characters
        this.registerGameObject(CleanerCharacter);

        // Actions
        this.registerAction(OpenAction);
        this.registerGameObject(DealerCharacter);

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
            wantsToHelpCleaner: false,
            pickedUpFocusDrink: false,
            pickedUpFork: false,
            pickedUpPainting: false,
            pickedUpBucket: false,
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
