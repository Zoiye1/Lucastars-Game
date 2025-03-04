import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Action } from "../../game-base/actions/Action";

// Interface for items that can be used
@Interface
export abstract class Usable {
    public abstract use(): ActionResult | undefined;
}

export class UseAction extends Action {
    public static readonly Alias: string = "use";

    public constructor() {
        super(UseAction.Alias, true);
    }

    public name(): string {
        return "Use";
    }

    public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        const gameObject: GameObject = gameObjects[0];

        if (gameObject.instanceOf(Usable)) {
            return gameObject.use();
        }

        return new TextActionResult(["That doesn't make any sense."]);
    }
}
