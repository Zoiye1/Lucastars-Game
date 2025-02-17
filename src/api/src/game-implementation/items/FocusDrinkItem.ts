import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";

export class FocusDrinkItem extends Item implements Examine {
    public static readonly Alias: string = "FocusDrink";

    public constructor() {
        super(FocusDrinkItem.Alias);
    }

    public name(): string {
        return "FocusDrink";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a focus drink."]);
    }
}
