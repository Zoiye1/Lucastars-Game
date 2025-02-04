import { ActionResult } from "../actionResults/ActionResult";
import { GameObject } from "../gameObjects/GameObject";
import { Action } from "./Action";

/**
 * Interface for game objects that need to support a simple action
 */
@Interface
export abstract class Simple {
    /**
     * Execute a simple action
     *
     * @param alias Alias of the simple action to execute
     *
     * @returns Result of the simple action or `undefined` if unhandled
     */
    public abstract simple(alias: string): ActionResult | undefined;
}

/**
 * Class used to represent a simple action
 */
export class SimpleAction extends Action {
    /** Name of this action */
    private _name: string;

    /**
     * Create a new instance of the simple action
     *
     * @param alias Alias used to identify this action
     * @param name Name of this action
     */
    public constructor(alias: string, name: string) {
        super(alias, false);

        this._name = name;
    }

    /**
     * @inheritdoc
     */
    public name(): string {
        return this._name;
    }

    /**
     * @inheritdoc
     */
    public execute(alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        return SimpleAction.execute(alias, gameObjects[0]);
    }

    /**
     * Execute a simple action
     *
     * @param alias Alias used to identify the kind of simple action
     * @param gameObject Game object on which the simple action should be executed.
     *
     * @remarks Available as a static function so the `BaseGameService` can try to execute a simple action if an action class cannot be found for a given alias
     *
     * @returns Result of the simple action or `undefined` if unhandled
     */
    public static execute(alias: string, gameObject: GameObject): ActionResult | undefined {
        if (gameObject.instanceOf(Simple)) {
            return gameObject.simple(alias);
        }

        return undefined;
    }
}
