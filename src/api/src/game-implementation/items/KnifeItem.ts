import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { PickUp } from "../actions/PickUpAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class KnifeItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "KnifeItem";

    public constructor() {
        super(KnifeItem.Alias);
    }

    public name(): string {
        return "Knife";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "There is a knife hanging from the wall",
            "It looks very Sharp!",
        ]);
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpKnife = true;

        return new TextActionResult(["You have picked up the Knife!."]);
    }
}
