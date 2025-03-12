import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { TargetItem } from "../../game-base/gameObjects/TargetItem";

export class WindowItem extends TargetItem implements Examine {
    public static readonly Alias: string = "WindowItem";

    public constructor() {
        super(WindowItem.Alias);
    }

    public name(): string {
        return "Window";
    }

    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["A window leading to the hallway. It's locked."]);
    }

    /**
     * Handle using an inventory item on this window
     */
    public useWith(sourceItem: GameObject): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // Check if using the painting on the window
        if (sourceItem.alias === "PaintingItem") {
            playerSession.windowBroken = true;
            // Remove the painting from inventory since it's been used
            const inventory = playerSession.inventory;
            const index = inventory.indexOf("PaintingItem");
            if (index !== -1) {
                inventory.splice(index, 1);
            }

            return new TextActionResult([
                "You throw the painting at the window, shattering it!",
                "You can now enter the hallway.",
            ]);
        }

        return new TextActionResult(["That doesn't seem to work on the window."]);
    }
}
