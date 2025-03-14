import { Arrowroom } from "@shared/types";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { OpenAction } from "../../game-base/actions/OpenAction";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { BoxStorageItem } from "../items/BoxStorageItem";
import { ClosetStorageItem } from "../items/ClosetStorageItem";
import { ElevatorStorageItem } from "../items/ElevatorStorageItem";
import { KeypadStorageItem } from "../items/KeypadStorageItem";
import { PlayerSession } from "../types";
import { PickUpAction } from "../actions/PickUpAction";
import { KeyCardItem } from "../items/KeyCardItem";
import { WirecutterItem } from "../items/WirecutterItem";
import { GlueItem } from "../items/GlueItem";

export class StorageRoom extends Room {
    public static readonly Alias: string = "StorageRoom";

    public constructor() {
        super(StorageRoom.Alias);
    }

    public name(): string {
        return "StorageRoom";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["room"];
    }

    public images(): string[] {
        const result: string[] = ["storage/Storage"];
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (playerSession.playerOpenedCloset) {
            result.push("storage/Opencloset");
        }
        if (playerSession.playerOpenedSteelbox) {
            result.push("storage/Openbox");
        }
        return result;
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new OpenAction(),
            new PickUpAction(),
        ];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You enter into the storage room.",
            "There is a closet and toolbox",
            "there is also and elevator in the back of the storage room with a keypad",
        ]);
    }

    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [
            new ClosetStorageItem(),
            new BoxStorageItem(),
            new ElevatorStorageItem(),
            new KeypadStorageItem(),
        ];

        if (playerSession.playerOpenedCloset) {
            if (!playerSession.pickedUpKeyCard) {
                result.push(new KeyCardItem());
            }
            if (!playerSession.pickedUpWirecutter) {
                result.push(new WirecutterItem());
            }
        }
        if (playerSession.playerOpenedSteelbox) {
            if (!playerSession.pickedUpGlue) {
                result.push(new GlueItem());
            }
        }
        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Kitchen", alias: "KitchenRoom", imageRotation: -90, imageCoords: { x: 15, y: 65 } },
        ];

        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (playerSession.playerOpenedDoorToStorage) {
            result.push(
                { name: "Elevator", alias: "labroom", imageRotation: 180, imageCoords: { x: 68, y: 7 } }
            );
        }

        return result;
    }
}
