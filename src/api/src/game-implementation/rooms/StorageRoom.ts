import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { OpenAction } from "../../game-base/actions/OpenAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { BoxStorageItem } from "../items/BoxStorageItem";
import { ClosetStorageItem } from "../items/ClosetStorageItem";
import { ElevatorStorageItem } from "../items/ElevatorStorageItem";
import { KeypadStorageItem } from "../items/KeypadStorageItem";
import { KitchenRoom } from "./KitchenRoom";

export class StorageRoom extends Room implements Simple {
    public static readonly Alias: string = "StorageRoom";

    public constructor() {
        super(StorageRoom.Alias);
    }

    public name(): string {
        return "StorageRoom";
    }

    public images(): string[] {
        return ["storage/Storage", "storage/StorageToKitchen"];
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new OpenAction(),
            new SimpleAction("Kitchen-enter", "Go to Kitchen")];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You enter into the storage room.",
            "There is a closet and toolbox",
            "there is also and elevator in the back of the storage room with a keypad",
        ]);
    }

    public objects(): GameObject[] {
        return [
            new ClosetStorageItem(),
            new BoxStorageItem(),
            new ElevatorStorageItem(),
            new KeypadStorageItem(),
        ];
    }

    public simple(alias: string): ActionResult | undefined {
        let room: Room | undefined;
        switch (alias) {
            case "Kitchen-enter":
                room = new KitchenRoom();
                break;
        }
        if (room) {
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine();
        }
        return undefined;
    }
}
