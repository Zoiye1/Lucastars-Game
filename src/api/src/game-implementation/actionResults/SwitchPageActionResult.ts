import { ActionResult } from "../../game-base/actionResults/ActionResult";

/**
 * Class used to instruct the client application to switch to another page
 */
export class SwitchPageActionResult extends ActionResult {
    /** Alias of the page to switch to */
    private _page: string;

    /**
     * Create a new instance of the Switch Page action result
     *
     * @param page Alias of the page to switch to
     */
    public constructor(page: string) {
        super();

        this._page = page;
    }

    /**
     * Get the alias of the page to switch to
     */
    public get page(): string {
        return this._page;
    }
}
