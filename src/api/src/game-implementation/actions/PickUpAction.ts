import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Action } from "../../game-base/actions/Action";
import { GameObject } from "../../game-base/gameObjects/GameObject";

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

        if (gameObject.instanceOf(PickUp)) {
            return gameObject.pickUp();
        }

        return undefined;
    }
}
