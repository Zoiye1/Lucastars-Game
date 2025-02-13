import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { cookCharacter } from "../characters/cookCharacter";

export class KitchenRoom extends Room {
    public static readonly Alias: string = "KitchenRoom";
    public constructor() {
        super(KitchenRoom.Alias);
    }

    public name(): string {
        return "Kitchen";
    }

    public images(): string[] {
        return ["Kitchen", "Cook"];
    }

    public objects(): GameObject[] {
        return [
            new cookCharacter(),
        ];
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new TalkAction(),
        ];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "You walk into the kitchen",
            "As you walk in you see a cook busy working on some food",
            "In de back there is a metal door.",
        ]);
    }
}
