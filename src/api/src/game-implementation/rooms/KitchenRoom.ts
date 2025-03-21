import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { OpenAction } from "../../game-base/actions/OpenAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { cookCharacter } from "../characters/cookCharacter";
import { DoorKitchenItem } from "../items/DoorKitchenItem";
import { KnifeItem } from "../items/KnifeItem";
import { SugarItem } from "../items/SugarItem";
import { PickUpAction } from "../actions/PickUpAction";
import { PlayerSession } from "../types";
import { Arrowroom, ClickItem } from "@shared/types";

export class KitchenRoom extends Room {
    public static readonly Alias: string = "KitchenRoom";
    public constructor() {
        super(KitchenRoom.Alias);
    }

    public name(): string {
        return "Kitchen";
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
        // return ["kitchen/Kitchen", "kitchen/Cook", "kitchen/ArrowToCafKitchen4", "kitchen/KnifeKitchen", "kitchen/BagOfSugar"];
        const result: string[] = ["kitchen/Kitchen"];
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (!playerSession.pickedUpKnife) {
            result.push("kitchen/KnifeKitchen");
        }
        if (!playerSession.pickedUpSugar) {
            result.push("kitchen/BagOfSugar");
        }
        // if (playerSession.playerOpenedDoorToStorage) {
        //     result.push("kitchen/ArrowToStorageKitchen4");
        // }
        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Always give 4 paramaters for Arrowroom objects: The name (will be displayed), alias of room to send player to,
        // The image rotation and the x-y coords of the arrow

        // result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "cafeteria", alias: "cafeteria", imageRotation: 90, imageCoords: { x: 77, y: 60 } },
        ];
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // Only add the arrow is the player actually opened the door
        if (playerSession.playerOpenedDoorToStorage) {
            result.push(
                { name: "storage", alias: "StorageRoom", imageRotation: 180, imageCoords: { x: 46, y: 18 } }
            );
        }

        return result;
    }

    public ClickItem(): ClickItem[] {
        // Always give 4 paramaters for Click objects: The name (will be displayed), alias,
        // The imageurl and the types

        // result as an array of ClickItem objects
        const result: ClickItem[] = [
            { name: "Cook", alias: "cook", imageUrl: "kitchen/Cook1", type: ["npc"], imageCoords: { x: 60, y: 47 } },
        ];

        return result;
    }

    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [new cookCharacter(),
            new DoorKitchenItem(),
        ];
        if (!playerSession.pickedUpKnife) {
            result.push(new KnifeItem());
        }
        if (!playerSession.pickedUpSugar) {
            result.push(new SugarItem());
        }
        return result;
    }

    public actions(): Action[] {
        const result: Action[] = [
            new ExamineAction(),
            new TalkAction(),
            new OpenAction(),
            new PickUpAction(),
        ];
        return result;
    }

    public examine(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ([
            "You walk into the kitchen",
            "A cook is busy at the counter, focused on preparing food.",
            "At the back of the room, there’s a metal door.",
        ]);
        if (!playerSession.pickedUpSugar) {
            result.push("On top of the fridge, a bag of sugar rests");
        }
        if (!playerSession.pickedUpKnife) {
            result.push("and a knife hangs from the wall.");
        }
        return new TextActionResult(result);
    }
}
