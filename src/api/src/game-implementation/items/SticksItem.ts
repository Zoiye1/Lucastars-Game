import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";

export class SticksItem extends Item implements Examine {
    public static readonly Alias: string = "Sticks";

    public constructor() {
        super(SticksItem.Alias);
    }

    public name(): string {
        return "Sticks";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["These are 4 sticks"]);
    }
}
