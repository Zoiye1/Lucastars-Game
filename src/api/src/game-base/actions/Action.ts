import { ActionResult } from "../actionResults/ActionResult";
import { GameObject } from "../gameObjects/GameObject";

/**
 * Base class used to represent an action
 */
export abstract class Action {
    /** Alias used to identify this action */
    private _alias: string;

    /** Set to `true` if this action requires another `GameObject` to work, otherwise `false`. */
    private _needsObject: boolean;

    /**
     * Create a new instance of the custom action
     *
     * @param alias Alias used to identify this action
     * @param needsObject Set to `true` if this action requires another `GameObject` to work, otherwise `false`.
     */
    protected constructor(alias: string, needsObject: boolean) {
        this._alias = alias;
        this._needsObject = needsObject;
    }

    /**
     * Get the alias used to identify this action
     */
    public get alias(): string {
        return this._alias;
    }

    /**
     * Get the name of this action
     */
    public abstract name(): SyncOrAsync<string>;

    /**
     * Returns `true` if this action requires another `GameObject` to work, otherwise `false`.
     */
    public get needsObject(): boolean {
        return this._needsObject;
    }

    /**
     * Execute the action
     *
     * @param alias Alias used to identify the kind of action
     * @param gameObjects Array of game objects, where the first index is a reference to the game object on which the action should be executed.
     *
     * @returns Result of the action or `undefined` if unhandled
     */
    public abstract execute(alias: string, gameObjects: GameObject[]): ActionResult | undefined;
}
