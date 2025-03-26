import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Open } from "../../game-base/actions/OpenAction";
import { gameService } from "../../global";
import { PlayerSession } from "../types";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";

export class WardrobeItem extends Item implements Examine, Open {
    public static readonly Alias: string = "wardrobe";

    public constructor() {
        super(WardrobeItem.Alias);
    }

    public name(): string {
        return "Wardrobe";
    }

    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a wardrobe."]);
    }

    public open(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (!playerSession.wardrobeOpened) {
            playerSession.wardrobeOpened = true;
            return new TextActionResult(["You opened the wardrobe and found sheets."]);
        }
        return new TextActionResult(["The wardrobe is already open!"]);
    }
}
