import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { Usable } from "../actions/UseAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

/**
 * Class die een boom in het spel vertegenwoordigt.
 * De speler kan het onderzoeken of proberen te gebruiken.
 */
export class TreeItem extends Item implements Examine, Usable {
    /** De alias voor de boom item. */
    public static readonly Alias: string = "TreeItem";

    /**
     * Maakt een nieuwe instantie van TreeItem aan.
     */
    public constructor() {
        super(TreeItem.Alias);
    }

    /**
     * Haalt de weergavenaam van het item op.
     * @returns {string} De naam van het item
    */
    public name(): string {
        return "Tree";
    }

    /**
     * Geeft de type van de GameObject terug*
     *  @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    /**
     * Onderzoekt de boom item en geeft een beschrijving.
     * @returns {ActionResult | undefined} Het resultaat van het onderzoeken van de boom.
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["A tree. It looks like some of the branches are loose..."]);
    }

    /**
     * Probeert het boom item te gebruiken.
     * Als de speler een hamer heeft, kan hij de boom stuk slaan.
     * @returns {ActionResult | undefined} Het resultaat van het proberen te gebruiken van de boom.
     */
    public use(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const inventory: string[] = playerSession.inventory;
        if (!inventory.includes("10 Sticks")) {
            inventory.push("10 Sticks");
            return new TextActionResult([
                "You have received 10 sticks",
                "Smoker: \"HEY!! Why did you chop that tree man...\"",
            ]);
        }
        else {
            return new TextActionResult([
                "Smoker: Watcha doin BRO! You trippin dawg? Leave that tree alone..",
            ]);
        };
    }
}
