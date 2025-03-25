import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { TargetItem } from "../../game-base/gameObjects/TargetItem";

export class RoofItem extends TargetItem implements Examine {
    public static readonly Alias: string = "RoofItem";

    public constructor() {
        super(RoofItem.Alias);
    }

    public name(): string {
        return "Roof";
    }

    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "You're standing on the rooftop, the wind howling around you.",
            "A dangerous drop lies ahead. Maybe there's a safer way down...",
        ]);
    }

    /**
     * Handle using an inventory item on the roof
     */
    public useWith(sourceItem: GameObject): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // Check if using the parachute on Roof
        if (sourceItem.alias === "ParachuteItem") {
            playerSession.EscapedRoof = true;

            return new TextActionResult(["Your parachute is strapped in tight, the wind pressing against you.",
                "You need to escape now there is no time to wait.",
            ]);
        }

        return undefined;
    }
}
