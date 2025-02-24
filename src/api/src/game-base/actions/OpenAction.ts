import { ActionResult } from "../actionResults/ActionResult";
import { GameObject } from "../gameObjects/GameObject";
import { Action } from "./Action";

@Interface
export abstract class Open {
    public abstract open(): ActionResult | undefined;
}

export class OpenAction extends Action {
    public static readonly Alias: string = "open";

    public constructor() {
        super(OpenAction.Alias, true);
    }

    public name(): SyncOrAsync<string> {
        return "Open";
    }

    public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        const gameObject: GameObject = gameObjects[0];

        if (gameObject.instanceOf(Open)) {
            return gameObject.open();
        }
        return undefined;
    }
}
