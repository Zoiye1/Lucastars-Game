import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { Usable } from "../actions/UseAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class WindowItem extends Item implements Examine, Usable {
    public static readonly Alias: string = "WindowItem";

    public constructor() {
        super(WindowItem.Alias);
    }

    public name(): string {
        return "Window";
    }

    /**

    Geeft de type van de GameObject terug*
    @returns De type van de GameObject (GameObjectType union) */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["A window leading to the hallway. It's locked."]);
    }

    public use(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const hasPainting: boolean = playerSession.pickedUpPainting;

        if (hasPainting) {
            playerSession.windowBroken = true;
            return new TextActionResult(["You throw the painting at the window, shattering it! You can now enter the hallway."]);
        }

        return new TextActionResult(["You need something heavy to break the window."]);
    }
}
