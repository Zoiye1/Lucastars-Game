import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Open } from "../../game-base/actions/OpenAction";
import { gameService } from "../../global";
import { PlayerSession } from "../types";

export class DoorKitchenItem extends Item implements Examine, Open {
    public static readonly Alias: string = "door";

    public constructor() {
        super(DoorKitchenItem.Alias);
    }

    public name(): SyncOrAsync<string> {
        return "Door";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a steel door.",

        ]);
    }

    public open(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (!playerSession.playerOpenedDoorToStorage) {
            if (playerSession.inventory.includes("Key-Storage")) {
                playerSession.playerOpenedDoorToStorage = true;
                return new TextActionResult(["You use the key to open the door",
                ]);
            }
            return new TextActionResult(["It seems to be locked.",
            ]);
        }
        return new TextActionResult(["The door is already open!.",
        ]);
    }
}
