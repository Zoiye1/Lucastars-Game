import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Open } from "../../game-base/actions/OpenAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { gameService } from "../../global";
import { KnifeItem } from "./KnifeItem";

export class BoxStorageItem extends Item implements Examine, Open {
    public static readonly Alias: string = "steel box";

    public constructor() {
        super(BoxStorageItem.Alias);
    }

    public name(): SyncOrAsync<string> {
        return "Steel box";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This seems to be a small green steel box with a lock on it",

        ]);
    }

    public open(): ActionResult | undefined {
        const inventory: GameObject[] = gameService.getGameObjectsFromInventory();
        const result: GameObject | undefined = inventory.find(e => e.alias === KnifeItem.Alias);
        if (gameService.getPlayerSession().playerOpenedSteelbox) {
            return new TextActionResult(["Its already open"]);
        }
        if (result !== undefined) {
            gameService.getPlayerSession().playerOpenedSteelbox = true;
            return new TextActionResult(["You use the sharp end of the knife to open the green steelbox.",
                "There is Glue inside",
            ]);
        }
        return new TextActionResult(["You cant open it the lock is preventing it", "Maybe you could lockpick it with something sharp",
        ]);
    }
}
