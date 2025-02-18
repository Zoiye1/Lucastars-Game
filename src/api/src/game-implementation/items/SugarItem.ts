import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";

export class SugarItem extends Item implements Examine {
    public static readonly Alias: string = "SugarItem";

    public constructor() {
        super(SugarItem.Alias);
    }

    public name(): string {
        return "Sugar";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "This seems to be a large bag of sugar",
        ]);
    }
}
