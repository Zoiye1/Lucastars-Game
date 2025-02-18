import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";

export class KnifeItem extends Item implements Examine {
    public static readonly Alias: string = "KnifeItem";

    public constructor() {
        super(KnifeItem.Alias);
    }

    public name(): string {
        return "Knife";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "There is a knife hanging from the wall",
            "It looks very Sharp!",
        ]);
    }
}
