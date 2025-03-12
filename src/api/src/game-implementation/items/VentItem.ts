import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { TargetItem } from "../../game-base/gameObjects/TargetItem";

export class VentItem extends TargetItem implements Examine {
    public static readonly Alias: string = "VentItem";

    public constructor() {
        super(VentItem.Alias);
    }

    public name(): string {
        return "Ventilation";
    }

    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "A ventilation grate. It's securely fastened with screws.",
            "If only you had something to pry it open...",
        ]);
    }

    /**
     * Handle using an inventory item on this vent
     */
    public useWith(sourceItem: GameObject): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // Check if using the fork on the vent
        if (sourceItem.alias === "ForkItem") {
            playerSession.ventUnlocked = true;

            return new TextActionResult([
                "You use the fork to pry open the ventilation grate.",
                "The screws come loose and you can now enter the ventilation system!",
            ]);
        }

        return new TextActionResult(["That doesn't work on the ventilation grate."]);
    }
}
