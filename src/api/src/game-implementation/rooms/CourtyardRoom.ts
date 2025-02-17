import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Room } from "../../game-base/gameObjects/Room";

export class CourtyardRoom extends Room {
    public static readonly Alias: string = "courtyard";

    public constructor() {
        super(CourtyardRoom.Alias);
    }

    public name(): string {
        return "Courtyard";
    }

    public images(): string[] {
        return ["courtyard/courtyardInitial"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["Welcome to the courtyard."]);
    }
}
