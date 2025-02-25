import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { ForkItem } from "../items/ForkItem";
import { PaintingItem } from "../items/PaintingItem";
import { HallwayRoom } from "./HallwayRoom";
import { PickUpAction } from "../actions/PickUpAction";
import { PlayerSession } from "../types";
import { VentsRoom } from "./VentsRoom";

export class StarterRoom extends Room implements Simple {
    public static readonly Alias: string = "starterroom";

    public constructor() {
        super(StarterRoom.Alias);
    }

    public name(): string {
        return "Starterroom";
    }

    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["starterroom/StarterRoomBackground"];

        if (!playerSession.pickedUpFork) {
            result.push("starterroom/StarterRoomFork");
        }

        if (!playerSession.pickedUpPainting) {
            result.push("starterroom/StarterRoomPainting");
        }

        return result;
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You wake up with a pounding headache",
            "You have no idea where you are. Your head throbs as you glance around the room.",
            "The door is locked. You need to find a way out!",
        ]);
    }

    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [];

        if (!playerSession.pickedUpFork) {
            result.push(new ForkItem());
        }

        if (!playerSession.pickedUpPainting) {
            result.push(new PaintingItem());
        }
        return result;
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new SimpleAction("enter-hallway", "Enter Hallway"),
            new SimpleAction("enter-vent", "Enter Vent"),
            new PickUpAction(),
        ];
    }

    public simple(alias: string): ActionResult | undefined {
        let room: Room | undefined;
        switch (alias) {
            case "enter-hallway":
                room = new HallwayRoom();
                break;
            case "enter-vent":
                room = new VentsRoom();
                break;
        }
        if (room) {
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine();
        }
        return undefined;
    }
}
