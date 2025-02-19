import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { HammerItem } from "../items/HammerItem";
import { SticksItem } from "../items/SticksItem";

export class RoofRoom extends Room {
    public static readonly Alias: string = "roof";

    public constructor() {
        super(RoofRoom.Alias);
    }

    public name(): string {
        return "Roof";
    }

    public images(): string[] {
        return ["Roof/RoofBackground", "Roof/Hammer", "Roof/Sticks"];
    }

    public objects(): GameObject[] {
        return [
            new HammerItem(),
            new SticksItem(),
        ];
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
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
