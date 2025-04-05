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
import { BakingSodaItem } from "../items/BakingSodaItem";

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
            { name: "cafeteria", alias: "cafeteria", imageRotation: 90, imageCoords: { x: 80, y: 83 } },
        ];
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // Only add the arrow is the player actually opened the door
        if (playerSession.playerOpenedDoorToStorage) {
            result.push(
                { name: "storage", alias: "StorageRoom", imageRotation: 180, imageCoords: { x: 43, y: 20 } }
            );
        }

        return result;
    }

    public ClickItem(): ClickItem[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // Always give 4 paramaters for Click objects: The name (will be displayed), alias,
        // The imageurl and the types

        // result as an array of ClickItem objects
        const result: ClickItem[] = [
            { name: "Cook", alias: "cook", imageUrl: "gif/Cook", type: ["npc"], imageCoords: { x: 15, y: 45} },
        ];
        if (!playerSession.playerOpenedDoorToStorage) {
            result.push({ name: "Door", alias: "door", imageUrl: "kitchen/DoorClosedStorage", type: ["actionableItemOpen"], imageCoords: { x: 40, y: 36 } });
        }
        if (playerSession.playerOpenedDoorToStorage) {
            result.push({ name: "Door", alias: "door", imageUrl: "kitchen/DoorOpenStorage", type: ["actionableItemOpen"], imageCoords: { x: 40, y: 36 } });
        }
        if (!playerSession.pickedUpKnife) {
            result.push({ name: "Knife", alias: "KnifeItem", imageUrl: "kitchen/KnifeKitchen", type: ["actionableItem"], imageCoords: { x: 25, y: 42 } });
        }
        if (!playerSession.pickedUpSugar) {
            result.push({ name: "Sugar", alias: "SugarItem", imageUrl: "kitchen/BagOfSugar", type: ["actionableItem"], imageCoords: { x: 77, y: 19 } });
        }
        if (!playerSession.pickedUpBakingSoda) {
            result.push({ name: "BakingSoda", alias: "BakingSodaItem", imageUrl: "kitchen/BakingSoda", type: ["actionableItem"], imageCoords: { x: 4, y: 55 } });
        }
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
        if (!playerSession.pickedUpBakingSoda) {
            result.push(new BakingSodaItem());
        }
        return result;
    }

    public actions(): Action[] {
        const result: Action[] = [
            new ExamineAction(),
            new OpenAction(),
            new TalkAction(),
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
