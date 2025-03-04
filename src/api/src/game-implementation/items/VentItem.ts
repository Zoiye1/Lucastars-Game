/**
 * Vertegenwoordigt een ventilatie-item dat onderzocht en gebruikt kan worden.
 * De ventilatieopening is aanvankelijk vastgeschroefd en vereist een gereedschap om te openen.
 */
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { Usable } from "../actions/UseAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

/**
 * Klasse die een ventilatie-item in het spel vertegenwoordigt.
 * De speler kan het onderzoeken of proberen te gebruiken.
 */
export class VentItem extends Item implements Examine, Usable {
    /** De alias voor het ventilatie-item. */
    public static readonly Alias: string = "VentItem";

    /**
     * Maakt een nieuwe instantie van VentItem aan.
     */
    public constructor() {
        super(VentItem.Alias);
    }

    /**
     * Haalt de weergavenaam van het item op.
     * @returns {string} De naam van het ventilatie-item.
     */
    public name(): string {
        return "Vent";
    }

    /**

    Geeft de type van de GameObject terug*
    @returns De type van de GameObject (GameObjectType union) */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    /**
     * Onderzoekt het ventilatie-item en geeft een beschrijving.
     * @returns {ActionResult | undefined} Het resultaat van het onderzoeken van de ventilatie.
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["A metal vent cover. It's screwed shut."]);
    }

    /**
     * Probeert het ventilatie-item te gebruiken.
     * Als de speler een vork heeft, kan hij de ventilatieopening losschroeven.
     * @returns {ActionResult | undefined} Het resultaat van het proberen te gebruiken van de ventilatie.
     */
    public use(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const hasFork: boolean = playerSession.pickedUpFork;

        if (hasFork) {
            playerSession.ventUnlocked = true;
            return new TextActionResult([
                "You use the fork to unscrew the vent cover. You can now enter the vent.",
            ]);
        }

        return new TextActionResult([
            "You need something to unscrew the vent cover.",
        ]);
    }
}
