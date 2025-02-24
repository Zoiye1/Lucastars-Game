import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { HammerItem } from "../items/HammerItem";
import { SticksItem } from "../items/SticksItem";
import { PlayerSession } from "../types";

export class RoofRoom extends Room {
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
}
