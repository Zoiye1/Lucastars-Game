import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";

export class BucketItem extends Item implements Examine {
    public static readonly Alias: string = "bucket";

    public constructor() {
        super(BucketItem.Alias);
    }

    public name(): string {
        return "Bucket";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["It's a bucket."]);
    }
}
