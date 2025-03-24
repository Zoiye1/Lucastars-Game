import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { TargetItem } from "../../game-base/gameObjects/TargetItem";

export class MetalDoorItem extends TargetItem implements Examine {
    public static readonly Alias: string = "MetalDoorItem";

    public constructor() {
        super(MetalDoorItem.Alias);
    }

    public name(): string {
        return "MetalDoor";
    }

    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["Its a metal door, it seems to be locked..."]);
    }

    /**
     * Handle using an inventory item on this window
     */
    public useWith(sourceItem: GameObject): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // Check if using the painting on the window
        if (sourceItem.alias === "CorrosiveAcid") {
            playerSession.EscapedLab = true;
            // Remove the painting from inventory since it's been used
            const inventory = playerSession.inventory;
            const index = inventory.indexOf("CorrosiveAcid");
            if (index !== -1) {
                inventory.splice(index, 1);
            }

            return new TextActionResult([
                "You pour the liquid onto the metal door, the door melts, creating an opening...",
                "You can now enter the Escape!.",
            ]);
        }

        return new TextActionResult(["That doesn't seem to work on the metal door."]);
    }
}
