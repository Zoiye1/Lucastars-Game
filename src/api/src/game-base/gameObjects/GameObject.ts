/**
 * Base class used to represent a game object
 */
export abstract class GameObject {
    /** Alias of this game object */
    private _alias: string;

    /**
     * Create a new instance of this game object
     *
     * @param alias Alias of this game object
     */
    protected constructor(alias: string) {
        this._alias = alias;
    }

    /**
     * Get the alias of this game object
     */
    public get alias(): string {
        return this._alias;
    }

    /**
     * Get the name of this game object
     */
    public abstract name(): SyncOrAsync<string>;
}
