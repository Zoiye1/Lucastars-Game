import { ActionResult } from "../actionResults/ActionResult";
import { Action } from "../actions/Action";
import { ExamineAction } from "../actions/ExamineAction";
import { SimpleAction } from "../actions/SimpleAction";
import { TalkAction } from "../actions/TalkAction";
import { GameObject } from "../gameObjects/GameObject";
import { ExpressMiddleware, PlayerSessionType, getPlayerSessionFromContext, playerSessionMiddleware, resetPlayerSessionInContext } from "../playerSessionExpressMiddleware";

/**
 * Allowing referencing a class and enforce requirements on it
 *
 * @template T Class to reference
 */
type ClassReference<T> = {
    /** The class needs to have a static readonly `Alias` attribute */
    readonly Alias: string;

    /** The class needs to have an empty constructor */
    new(): T;
};

/**
 * Reference to a game object class
 */
type GameObjectClass = ClassReference<GameObject>;

/**
 * Reference to an action class
 */
type ActionClass = ClassReference<Action>;

/**
 * Base class used to operate the game engine
 *
 * @template T A type of player session
 */
export abstract class BaseGameService<T extends PlayerSessionType> {
    /** Alias used to distingish stored players sessions */
    private _sessionAlias: string;

    /** Map of game object aliases to a specific game object class */
    private _gameObjects: Map<string, GameObjectClass>;

    /** Map of action aliases to a specific action class */
    private _actions: Map<string, ActionClass>;

    /**
     * Create a new instance of the game service
     *
     * @param sessionAlias Alias used to distingish stored players sessions
     */
    protected constructor(sessionAlias: string) {
        this._sessionAlias = sessionAlias;
        this._gameObjects = new Map<string, GameObjectClass>();
        this._actions = new Map<string, ActionClass>();

        // Actions
        this.registerAction(TalkAction);
        this.registerAction(ExamineAction);
    }

    /**
     * Register a game object class
     *
     * @param gameObjectClass Game object class
     */
    protected registerGameObject(gameObjectClass: GameObjectClass): void {
        this._gameObjects.set(gameObjectClass.Alias, gameObjectClass);
    }

    /**
     * Register an action class
     *
     * @param actionClass Action class
     */
    protected registerAction(actionClass: ActionClass): void {
        this._actions.set(actionClass.Alias, actionClass);
    }

    /**
     * Create a new player session middleware for Express
     *
     * @remarks
     * This middleware does this following:
     * - Associate a player session of type {@link T} with a request, based on the provided `X-PlayerSessionId`-header.
     * - Regularly persist player sessions as JSON-files on the file system
     *
     * Keep in mind this middleware is not secure by any means, meaning the `X-PlayerSessionId`-header can be easily manipulated.
     *
     * @returns Middleware instance for Express
     */
    public createPlayerSessionMiddleware(): ExpressMiddleware {
        return playerSessionMiddleware(this._sessionAlias, () => this.createNewPlayerSession());
    }

    /**
     * Create a new player session object
     *
     * @remarks Used by {@link createPlayerSessionMiddleware}
     *
     * @returns New player session object
     */
    public abstract createNewPlayerSession(): T;

    /**
     * Get the player session from the current request
     *
     * @returns Player session from the current request
     */
    public getPlayerSession(): T {
        return getPlayerSessionFromContext<T>();
    }

    /**
     * Reset the player session
     */
    public resetPlayerSession(): void {
        resetPlayerSessionInContext(() => this.createNewPlayerSession());
    }

    /**
     * Get a list of game objects instances by their alias
     *
     * @param aliases List of game object aliases
     *
     * @returns List of game object instances. Can be empty when no game objects were found.
     */
    public getGameObjectsByAliases(aliases: string[]): GameObject[] {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return aliases.map(e => this.getGameObjectByAlias(e)).filter(e => e !== undefined) || [];
    }

    /**
     * Get a game object instance by its alias
     *
     * @param alias Game object alias
     *
     * @returns Game object instance or `undefined` when not found
     */
    public getGameObjectByAlias(alias: string): GameObject | undefined {
        // Use the alias to find the class reference of the game object
        const gameObjectClass: GameObjectClass | undefined = this._gameObjects.get(alias);

        // If no class reference is found, return immediately.
        if (!gameObjectClass) {
            return undefined;
        }

        // Otherwise, instance the game object.
        return new gameObjectClass();
    }

    /**
     * Exectute an action and get its result
     *
     * @param alias Alias of the action to execute
     * @param gameObjects List of game objects to execute the action on
     *
     * @returns Result of the action or `undefined` when unhandled.
     */
    public executeAction(alias: string, gameObjects: GameObject[]): SyncOrAsync<ActionResult | undefined> {
        let actionAlias: string = alias;

        // Check if the alias has more information. If so, extract just the alias of the action.
        const specialAliasIndex: number = actionAlias.indexOf(":");

        if (specialAliasIndex >= 0) {
            actionAlias = actionAlias.substring(0, specialAliasIndex);
        }

        // Use the alias to find the class reference of the action
        const actionClass: ActionClass | undefined = this._actions.get(actionAlias);

        // If no class reference is found, attempt executing it as a simple action.
        if (!actionClass) {
            return SimpleAction.execute(alias, gameObjects[0]);
        }

        // Otherwise, instance the action and execute it.
        return new actionClass().execute(alias, gameObjects);
    }
}
