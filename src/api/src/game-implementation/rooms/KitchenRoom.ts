import { ArrowRoom } from "@shared/types";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { OpenAction } from "../../game-base/actions/OpenAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { cookCharacter } from "../characters/CookCharacter";
import { DoorKitchenItem } from "../items/DoorKitchenItem";
import { KnifeItem } from "../items/KnifeItem";
import { SugarItem } from "../items/SugarItem";
import { CafeteriaRoom } from "./CafeteriaRoom";
import { StorageRoom } from "./StorageRoom";
import { PickUpAction } from "../actions/PickUpAction";
import { PlayerSession } from "../types";

export class KitchenRoom extends Room implements Simple {
    public static readonly Alias: string = "KitchenRoom";
    public constructor() {
        super(KitchenRoom.Alias);
    }

    public name(): string {
        return "Kitchen";
    }

    public images(): string[] {
        // return ["kitchen/Kitchen", "kitchen/Cook", "kitchen/ArrowToCafKitchen4", "kitchen/KnifeKitchen", "kitchen/BagOfSugar"];
        const result: string[] = ["kitchen/Kitchen", "kitchen/Cook"];
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (!playerSession.pickedUpKnife) {
            result.push("kitchen/KnifeKitchen");
        }
        if (!playerSession.pickedUpSugar) {
            result.push("kitchen/BagOfSugar");
        }
        return result;
    }

    public ArrowUrl(): ArrowRoom[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: ArrowRoom[] =
         [
             { ImageLocation: "kitchen/ArrowToCafKitchen4", OnClickEvent: "CafeteriaRoom" },
         ];
        if (playerSession.playerOpenedDoorToStorage) {
            result.push({ ImageLocation: "kitchen/ArrowToStorageKitchen4", OnClickEvent: "StorageRoom" });
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
        return result;
    }

    public actions(): Action[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: Action[] = [
            new ExamineAction(),
            new TalkAction(),
            new OpenAction(),
            new PickUpAction(),
            new SimpleAction("caf-door", "Go to cafeteria"),
        ];
        if (playerSession.playerOpenedDoorToStorage) {
            result.push(new SimpleAction("storage-door", "Use storage door"));
        }
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

    public simple(alias: string): ActionResult | undefined {
        let room: Room | undefined;
        switch (alias) {
            case "storage-door":
                room = new StorageRoom();
                break;
            case "caf-door":
                room = new CafeteriaRoom();
                break;
        }
        if (room) {
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine();
        }
        return undefined;
    }
}
