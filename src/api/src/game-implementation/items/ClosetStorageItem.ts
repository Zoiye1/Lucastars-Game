import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Open } from "../../game-base/actions/OpenAction";
import { gameService } from "../../global";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { KnifeItem } from "./KnifeItem";

export class ClosetStorageItem extends Item implements Examine, Open {
    public static readonly Alias: string = "closet";

    public constructor() {
        super(ClosetStorageItem.Alias);
    }

    public name(): SyncOrAsync<string> {
        return "Closet";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a steel closet.",

        ]);
    }

    public open(): ActionResult | undefined {
        const inventory: GameObject[] = gameService.getGameObjectsFromInventory();
        const result: GameObject | undefined = inventory.find(e => e.alias === KnifeItem.Alias);
        if (gameService.getPlayerSession().playerOpenedCloset) {
            return new TextActionResult(["Its already open"]);
        }
        if (result !== undefined) {
            gameService.getPlayerSession().playerOpenedCloset = true;
            return new TextActionResult(["You use the sharp end of the knife to open the closet",
                "There is a Wirecutter and a Keycard inside",
            ]);
        }
        return new TextActionResult(["You cant open it the lock is preventing it", "Maybe you could lockpick it with something sharp",
        ]);
    }
}
