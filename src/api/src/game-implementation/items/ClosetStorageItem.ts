import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Open } from "../../game-base/actions/OpenAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class ClosetStorageItem extends Item implements Examine, Open {
    public static readonly Alias: string = "closet";

    public constructor() {
        super(ClosetStorageItem.Alias);
    }

    public name(): SyncOrAsync<string> {
        return "Closet";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a steel closet.",

        ]);
    }

    public open(): ActionResult | undefined {
        return new TextActionResult(["It seems to be closed. Maybe I could open it by using something sharp?",
        ]);
    }
}
