import { BaseGameService } from "../../game-base/services/BaseGameService";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { StartupRoom } from "../rooms/StartupRoom";
import { PlayerSession } from "../types";
import { ToiletRoom } from "../rooms/ToiletRoom";
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
import { RoofRoom } from "../rooms/RoofRoom";
import { HammerItem } from "../items/HammerItem";
import { SticksItem } from "../items/SticksItem";
import { GymRoom } from "../rooms/GymRoom";
import { OpenAction } from "../../game-base/actions/OpenAction";
import { DoorKitchenItem } from "../items/DoorKitchenItem";
import { ClosetStorageItem } from "../items/ClosetStorageItem";
import { BoxStorageItem } from "../items/BoxStorageItem";
import { ElevatorStorageItem } from "../items/ElevatorStorageItem";
import { KeypadStorageItem } from "../items/KeypadStorageItem";
import { PickUpAction } from "../actions/PickUpAction";
import { ForkItem } from "../items/ForkItem";
import { HallwayRoom } from "../rooms/HallwayRoom";
import { StrangerRoom } from "../rooms/StrangerRoom";
import { PaintingItem } from "../items/PaintingItem";
import { BucketItem } from "../items/BucketItem";
import { DealerCharacter } from "../characters/DealerCharacters";
import { VentsRoom } from "../rooms/VentsRoom";
import { GymFreakCharacter } from "../characters/GymFreakCharacter";
import { SulfuricAcidItem } from "../items/SulfuricAcidItem";
import { GlassBeakerItem } from "../items/GlassBeakerItem";
import { LabRoom } from "../rooms/LabRoom";
import { JumpRopeItem } from "../items/JumpRopeItem";
import { SmokerCharacter } from "../characters/SmokerCharacter";
import { CourtyardTheEndRoom } from "../rooms/CourtyardTheEndRoom";
import { VentItem } from "../items/VentItem";
import { UseAction } from "../actions/UseAction";
import { WindowItem } from "../items/WindowItem";
import { ProfessorCharacter } from "../characters/ProfessorCharacter";
import { BakingSodaItem } from "../items/BakingSodaItem";
import { TreeItem } from "../items/TreeItem";
import { PlaceAction } from "../actions/PlaceAction";
import { SheetsItem } from "../items/SheetsItem";
import { AirFreshenerItem } from "../items/AirFreshenerItem";
import { GymTheEndRoom } from "../rooms/GymEndRoom";
import { ParachuteItem } from "../items/ParachuteItem";
import { RoofEndRoom } from "../rooms/RoofEndRoom";
import { LadderItem } from "../items/LadderItem";
import { GlueItem } from "../items/GlueItem";
import { KeyCardItem } from "../items/KeyCardItem";
import { CupBoardItem } from "../items/CupBoardItem";
import { LabEndRoom } from "../rooms/LabEndRoom";
import { CorrosiveAcidItem } from "../items/CorrosiveAcidItem";
import { MetalDoorItem } from "../items/MetalDoorItem";

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
        this.registerGameObject(ToiletRoom);
        this.registerGameObject(KitchenRoom);
        this.registerGameObject(StorageRoom);
        this.registerGameObject(RoofRoom);
        this.registerGameObject(GymRoom);
        this.registerGameObject(StarterRoom);
        this.registerGameObject(HallwayRoom);
        this.registerGameObject(StrangerRoom);
        this.registerGameObject(VentsRoom);
        this.registerGameObject(LabRoom);
        this.registerGameObject(CafeteriaRoom);
        this.registerGameObject(CourtyardRoom);
        this.registerGameObject(CourtyardTheEndRoom);
        this.registerGameObject(GymTheEndRoom);
        this.registerGameObject(RoofEndRoom);
        this.registerGameObject(LabEndRoom);

        // Items
        this.registerGameObject(BakingSodaItem);
        this.registerGameObject(TitleItem);
        this.registerGameObject(KnifeItem);
        this.registerGameObject(SugarItem);
        this.registerGameObject(HammerItem);
        this.registerGameObject(SticksItem);
        this.registerGameObject(DoorKitchenItem);
        this.registerGameObject(ClosetStorageItem);
        this.registerGameObject(BoxStorageItem);
        this.registerGameObject(ElevatorStorageItem);
        this.registerGameObject(KeypadStorageItem);
        this.registerGameObject(ForkItem);
        this.registerGameObject(PaintingItem);
        this.registerGameObject(SulfuricAcidItem);
        this.registerGameObject(GlassBeakerItem);
        this.registerGameObject(JumpRopeItem);
        this.registerGameObject(SulfuricAcidItem);
        this.registerGameObject(GlassBeakerItem);
        this.registerGameObject(VentItem);
        this.registerGameObject(WindowItem);
        this.registerGameObject(BucketItem);
        this.registerGameObject(TreeItem);
        this.registerGameObject(FocusDrinkItem);
        this.registerGameObject(SheetsItem);
        this.registerGameObject(AirFreshenerItem);
        this.registerGameObject(ParachuteItem);
        this.registerGameObject(LadderItem);
        this.registerGameObject(GlueItem);
        this.registerGameObject(KeyCardItem);
        this.registerGameObject(CupBoardItem);
        this.registerGameObject(SheetsItem);
        this.registerGameObject(CorrosiveAcidItem);
        this.registerGameObject(MetalDoorItem);

        // Characters
        this.registerGameObject(cookCharacter);
        this.registerGameObject(GymFreakCharacter);
        this.registerGameObject(SmokerCharacter);
        this.registerGameObject(CleanerCharacter);
        this.registerGameObject(ProfessorCharacter);

        // Actions
        this.registerAction(OpenAction);
        this.registerGameObject(DealerCharacter);
        this.registerAction(PickUpAction);
        this.registerAction(UseAction);
        this.registerAction(PlaceAction);
    }

    /**
     * @inheritdoc
     */
    public createNewPlayerSession(): PlayerSession {
        return {
            currentRoom: StartupRoom.Alias,
            inventory: [],
            selectedItemInventory: "",
            GaveTheForkToCook: false,
            ThreatenedCook: false,
            helpedCleaner: false,
            wantsToHelpCleaner: false,
            pickedUpFocusDrink: false,
            pickedUpHammer: false,
            pickedupSticks: false,
            pickedUpFork: false,
            pickedUpPainting: false,
            pickedUpBucket: false,
            pickedUpKnife: false,
            pickedUpSugar: false,
            pickedUpKey: false,
            playerOpenedDoorToStorage: false,
            helpedGymFreak: false,
            pickedUpGlassBeaker: false,
            pickedUpSulfuricAcid: false,
            playerOpenedSteelbox: false,
            playerOpenedCloset: false,
            pickedUpJumpRope: false,
            retrievedTenSticks: false,
            placedEscapeLadder: false,
            tradedWithSmoker: false,
            ventUnlocked: false,
            windowBroken: false,
            wantsToSearchGlassBeaker: false,
            wantsToSearchIngredients: false,
            pickedUpBakingSoda: false,
            helpedProfessor: false,
            questArray: [],
            helpedDealer: false,
            helpedSmoker: false,
            helpedCook: false,
            wantsToHelpDealer: false,
            wantsToHelpProfessor: false,
            wantsToHelpGymFreak: false,
            wantsToHelpSmoker: false,
            wantsToHelpCook: false,
            pickedUpSheets: false,
            pickedUpAirFreshener: false,
            equippedParachute: false,
            pickedUpKeyCard: false,
            pickedUpWirecutter: false,
            pickedUpGlue: false,
            EscapedLab: false,
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
