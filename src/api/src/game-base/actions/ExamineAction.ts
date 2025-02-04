import { ActionResult } from "../actionResults/ActionResult";
import { GameObject } from "../gameObjects/GameObject";
import { Action } from "./Action";

/**
 * Interface for game objects that need to support the Examine action
 */
@Interface
export abstract class Examine {
    /**
     * Execute the Examine action
     *
     * @returns Result of the Examine action or `undefined` if unhandled
     */
    public abstract examine(): ActionResult | undefined;
}

/**
 * Class used to represent the Examine action
 */
export class ExamineAction extends Action {
    /** Alias used to identity the Examine action */
    public static readonly Alias: string = "examine";

    /**
     * Create a new instance of the Examine action
     */
    public constructor() {
        super(ExamineAction.Alias, true);
    }

    /**
     * @inheritdoc
     */
    public name(): string {
        return "Examine";
    }

    /**
     * Execute the Examine action
     *
     * @param _alias Ignored
     * @param gameObjects Array of game objects, where the first index is a reference to the game object on which the Examine action should be executed.
     *
     * @returns Result of the Examine action or `undefined` if unhandled
     */
    public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        const gameObject: GameObject = gameObjects[0];

        if (gameObject.instanceOf(Examine)) {
            return gameObject.examine();
        }

        return undefined;
    }
}
