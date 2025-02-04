import { TalkChoice } from "../actions/TalkAction";
import { Character } from "../gameObjects/Character";
import { TextActionResult } from "./TextActionResult";

/**
 * Class used to represent the result of an Talk action
 */
export class TalkActionResult extends TextActionResult {
    /** Character who is offering the choices */
    private _character: Character;

    /** Choices available to the player */
    private _choices: TalkChoice[];

    /**
     * Create a new instance of this action result
     *
     * @param character Character who is offering the choices
     * @param text Text to show alongside the choices
     * @param choices Choices available to the player
     */
    public constructor(character: Character, text: string[], choices: TalkChoice[]) {
        super(text);

        this._character = character;
        this._choices = choices;
    }

    /**
     * Get the character who is offering the choices
     */
    public get character(): Character {
        return this._character;
    }

    /**
     * Get the choices available to the player
     */
    public get choices(): TalkChoice[] {
        return this._choices;
    }
}
