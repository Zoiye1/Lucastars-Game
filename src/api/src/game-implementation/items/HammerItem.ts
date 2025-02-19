import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";

export class HammerItem extends Item implements Examine {
    public static readonly Alias: string = "Hammer";

    public constructor() {
        super(HammerItem.Alias);
    }

    public name(): string {
        return "Hammer";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a hammer"]);
    }
}
