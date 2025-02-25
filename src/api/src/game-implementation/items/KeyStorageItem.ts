import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";

export class KeyItem extends Item implements Examine {
    public static readonly Alias: string = "KeyItem";

    public constructor() {
        super(KeyItem.Alias);
    }

    public name(): string {
        return "Key storage";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "A small silver key!",
        ]);
    }
}
