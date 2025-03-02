import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { GameObject } from "../../game-base/gameObjects/GameObject";

@Interface
export abstract class Use {
    public abstract use(): ActionResult | undefined;
}

export class UseItemAction extends Action {
    public static readonly Alias: string = "use";

    public constructor() {
        super(UseItemAction.Alias, true);
    }

    public name(): string {
        return "Use";
    }

    public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        const gameObject: GameObject = gameObjects[0];
        if (gameObject.instanceOf(Use)) {
            return gameObject.use();
        }
        return new TextActionResult(["You can't use that."]);
    }
}
