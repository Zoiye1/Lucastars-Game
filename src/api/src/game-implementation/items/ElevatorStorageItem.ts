import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Open } from "../../game-base/actions/OpenAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { PlayerSession } from "../types";
import { gameService } from "../../global";

export class ElevatorStorageItem extends Item implements Examine, Open {
    public static readonly Alias: string = "elevator";

    public constructor() {
        super(ElevatorStorageItem.Alias);
    }

    public name(): SyncOrAsync<string> {
        return "Elevator";
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
        return new TextActionResult(["This is a elevator.",

        ]);
    }

    public open(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (!playerSession.playerOpenedElevator) {
            if (playerSession.inventory.includes("KeyCardItem")) {
                playerSession.inventory.splice(playerSession.inventory.indexOf("KeyCardItem"));
                playerSession.playerOpenedElevator = true;
                return new TextActionResult(["You walk over to the keycard scanner and open the door",
                ]);
            }
            return new TextActionResult(["It seems to be locked. You're gonna need to get a Keycard",
            ]);
        }
        return new TextActionResult(["The door is already open!.",
        ]);
    }
}
