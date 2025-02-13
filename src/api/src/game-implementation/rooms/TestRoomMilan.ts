import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { cookCharacter } from "../characters/cookCharacter";
import { TitleItem } from "../items/TitleItem";

export class TestRoomMilan extends Room {
    public static readonly Alias: string = "TestRoom";
    public constructor() {
        super(TestRoomMilan.Alias);
    }

    public name(): string {
        return "testRoom";
    }

    public images(): string[] {
        return ["titlescreen", "chef"];
    }

    public objects(): GameObject[] {
        return [
            new TitleItem(),
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
            "HEY!",
            "THIS IS THE TITLESCREEN!",
            ":D",
            "There seems to be a cook here.",
        ]);
    }
}
