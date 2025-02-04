import { gameService } from "../../global";
import { ActionResult } from "../actionResults/ActionResult";
import { Character } from "../gameObjects/Character";
import { GameObject } from "../gameObjects/GameObject";
import { Action } from "./Action";

/**
 * Interface for game objects that need to support the Talk action
 */
@Interface
export abstract class Talk {
    /**
     * Execute the Talk action
     *
     * @param choiceId ID of the specific choice take into consideration
     *
     * @returns Result of the Talk action or `undefined` if unhandled
     */
    public abstract talk(choiceId?: number): ActionResult | undefined;
}

/**
 * Class used to represent the Talk action
 */
export class TalkAction extends Action {
    /** Alias used to identity the Talk action */
    public static readonly Alias: string = "talk";

    /**
     * Create a new instance of the Talk action
     */
    public constructor() {
        super(TalkAction.Alias, true);
    }

    /**
     * @inheritdoc
     */
    public name(): string {
        return "Talk To";
    }

    /**
     * Execute the Talk action
     *
     * @param alias Alias used to identify the kind of Talk action
     * @param gameObjects Array of game objects, where the first index is a reference to the game object on which the Talk action should be executed.
     *
     * @returns Result of the Talk action or `undefined` if unhandled
     */
    public execute(alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        // If the alias is an exact match, execute the talk action without a choice ID.
        if (alias === this.alias) {
            return this.executeTalk(gameObjects[0]);
        }

        // Otherwise, execute the talk action with a choice ID.
        return this.executeTalkWithChoice(alias);
    }

    /**
     * Execute the Talk action with a choice
     *
     * @param alias Alias containing the character alias and choice id
     *
     * @returns Result of the Talk action or `undefined` if unhandled
     */
    public executeTalkWithChoice(alias: string): ActionResult | undefined {
        const splitAlias: string[] = alias.split(":");

        const character: GameObject | undefined = gameService.getGameObjectByAlias(splitAlias[1]);

        if (!character) {
            return undefined;
        }

        const choiceId: number = parseInt(splitAlias[2]);

        return this.executeTalk(character, choiceId);
    }

    /**
     * Execute the Talk action
     *
     * @param gameObject Reference to the game object on which the Talk action should be executed
     * @param choiceId Optional ID of the specific choice to handle
     *
     * @returns Result of the Talk action or `undefined` if unhandled
     */
    private executeTalk(gameObject: GameObject, choiceId?: number): ActionResult | undefined {
        if (gameObject.instanceOf(Talk)) {
            return gameObject.talk(choiceId);
        }

        return undefined;
    }
}

/**
 * Class used to present a dialogue choice
 */
export class TalkChoice {
    /** ID of the choice */
    private _id: number;

    /** Text of the choice */
    private _text: string;

    /**
     * Create a new instance of a dialogue choice
     *
     * @param id ID of the choice
     * @param text Text of the choice
     */
    public constructor(id: number, text: string) {
        this._id = id;
        this._text = text;
    }

    /**
     * Get the ID of the choice
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Get the text of the choice
     */
    public get text(): string {
        return this._text;
    }

    /**
     * Get the action alias for this choice
     *
     * @param character Character who is offering the choice
     *
     * @returns Action alias for this choice
     */
    public toAlias(character: Character): string {
        return `${TalkAction.Alias}:${character.alias}:${this._id}`;
    }
}
