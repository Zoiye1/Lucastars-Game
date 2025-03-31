import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Open } from "../../game-base/actions/OpenAction";
import { PlayerSession } from "../types";
import { gameService } from "../../global";

export class KeypadStorageItem extends Item implements Examine, Open {
    public static readonly Alias: string = "KeypadItem";

    public constructor() {
        super(KeypadStorageItem.Alias);
    }

    public open(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (!playerSession.playerOpenedElevator) {
            if (playerSession.inventory.includes("KeyCardItem")) {
                playerSession.inventory.splice(playerSession.inventory.indexOf("KeyCardItem"), 1);
                playerSession.playerOpenedElevator = true;
                return new TextActionResult(["You use the keycard to open the door",
                ]);
            }
            return new TextActionResult(["It seems to be locked. You're gonna need to get a Keycard",
            ]);
        }
        return new TextActionResult(["The door is already open!.",
        ]);
    }

    public name(): string {
        return "Keypad";
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
        return new TextActionResult([
            "This seems to be used to open the elevator",
            "It seems to require somekind of key card to use",
        ]);
    }
}
