import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { TargetItem } from "../../game-base/gameObjects/TargetItem";

/**
 * Class die een boom in het spel vertegenwoordigt.
 * De speler kan het onderzoeken of proberen te gebruiken.
 */
export class TreeItem extends TargetItem implements Examine {
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
        return ["nonActionableItem"];
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
        if (!inventory.includes("6sticks")) {
            inventory.push("6sticks");
            return new TextActionResult([
                "You have received 10 sticks...",
                "Smoker: \"HEY!! Why did you chop that tree man...\"",
            ]);
        }
        else {
            return new TextActionResult([
                "Smoker: Watcha doin BRO! You trippin dawg? Leave that tree alone..",
            ]);
        };
    }

    public useWith(sourceItem: GameObject): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const inventory: string[] = playerSession.inventory;

        if (sourceItem.alias === "HammerItem") {
            if (!inventory.includes("6sticks")) {
                inventory.push("6sticks");
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

        return new TextActionResult(["That doesn't work on the tree."]);
    }
}
