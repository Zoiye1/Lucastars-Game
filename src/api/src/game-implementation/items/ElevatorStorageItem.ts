import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Open } from "../../game-base/actions/OpenAction";

export class ElevatorStorageItem extends Item implements Examine, Open {
    public static readonly Alias: string = "elevator";

    public constructor() {
        super(ElevatorStorageItem.Alias);
    }

    public name(): SyncOrAsync<string> {
        return "Elevator";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a elevator.",

        ]);
    }

    public open(): ActionResult | undefined {
        return new TextActionResult(["It seems to be locked.",
        ]);
    }
}
