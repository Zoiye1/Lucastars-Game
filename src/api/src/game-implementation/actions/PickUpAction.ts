import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Action } from "../../game-base/actions/Action";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { gameService } from "../../global";
import { PlayerSession } from "../types";

@Interface
export abstract class PickUp {
    public abstract pickUp(): ActionResult | undefined;
}

export class PickUpAction extends Action {
    public static readonly Alias: string = "pick-up";

    public constructor() {
        super(PickUpAction.Alias, true);
    }

    public name(): string {
        return "Pick up";
    }

    public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        const gameObject: GameObject = gameObjects[0];
        const playerSession: PlayerSession = gameService.getPlayerSession();

        if (gameObject.instanceOf(PickUp)) {
            playerSession.inventory.push(gameObject.alias);

            return gameObject.pickUp();
        }

        return undefined;
    }
}
