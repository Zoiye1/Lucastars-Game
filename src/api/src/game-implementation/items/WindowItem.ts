/**
 * Vertegenwoordigt een raamobject dat onderzocht en gebruikt kan worden.
 * Het raam is aanvankelijk vergrendeld en vereist een zwaar object om het te breken.
 */
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { Usable } from "../actions/UseAction";

/**
 * Klasse die een raamobject in het spel vertegenwoordigt.
 * De speler kan het onderzoeken of proberen te gebruiken.
 */
export class WindowItem extends Item implements Examine, Usable {
    /** De alias voor het raamobject. */
    public static readonly Alias: string = "WindowItem";

    /**
     * Maakt een nieuwe instantie van WindowItem aan.
     */
    public constructor() {
        super(WindowItem.Alias);
    }

    /**
     * Haalt de weergavenaam van het object op.
     * @returns {string} De naam van het raamobject.
     */
    public name(): string {
        return "Window";
    }

    /**
     * Onderzoekt het raamobject en geeft een beschrijving.
     * @returns {ActionResult | undefined} Het resultaat van het onderzoeken van het raam.
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["A window leading to the hallway. It's locked."]);
    }

    /**
     * Probeert het raamobject te gebruiken.
     * Als de speler een schilderij heeft, kan hij het raam breken.
     * @returns {ActionResult | undefined} Het resultaat van het proberen te gebruiken van het raam.
     */
    public use(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const hasPainting: boolean = playerSession.pickedUpPainting;

        if (hasPainting) {
            playerSession.windowBroken = true;
            return new TextActionResult([
                "You throw the painting at the window, shattering it! You can now enter the hallway.",
            ]);
        }

        return new TextActionResult([
            "You need something heavy to break the window.",
        ]);
    }
}
