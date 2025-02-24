import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { HammerItem } from "../items/HammerItem";
import { SticksItem } from "../items/SticksItem";
import { PlayerSession } from "../types";
import { VentsRoom } from "./VentsRoom";

export class RoofRoom extends Room implements Simple {
    public static readonly Alias: string = "roof";

    public constructor() {
        super(RoofRoom.Alias);
    }

    public name(): string {
        return "Roof";
    }

    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["Roof/RoofBackground"];

        if (!playerSession.pickedUpHammer) {
            result.push("Roof/Hammer");
        }
        if (!playerSession.pickedupSticks) {
            result.push("Roof/Sticks");
        }

        return result;
    }

    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [];

        if (!playerSession.pickedUpHammer) {
            result.push(new HammerItem());
        }

        if (!playerSession.pickedupSticks) {
            result.push(new SticksItem());
        }
        return result;
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new PickUpAction(),
            new SimpleAction("enter-vent", "Return to Vents"),
        ];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "The cold air hits your face as you step onto the roof",
            "The city below seems so close, yet still out of reach",
            "Scattered around you are 4 sticks and a hammer that might help you",
            "escape this place once and for all.",
        ]);
    }

    public simple(alias: string): ActionResult | undefined {
        let room: Room | undefined;
        switch (alias) {
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
