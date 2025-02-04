import { ActionResult } from "./ActionResult";

/**
 * Class used to represent the textual result of an action
 */
export class TextActionResult extends ActionResult {
    /** Text to show */
    private _text: string[];

    /**
     * Create a new instance of this action result
     *
     * @param text Text to show
     */
    public constructor(text: string[]) {
        super();

        this._text = text;
    }

    /**
     * Get the text to show
     */
    public get text(): string[] {
        return this._text;
    }
}
