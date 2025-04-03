import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { TargetItem } from "../../game-base/gameObjects/TargetItem";

/**
 * Een class die een boom in het spel vertegenwoordigt.
 * De speler kan de boom onderzoeken of proberen te gebruiken.
 */
export class TreeItem extends TargetItem implements Examine {
    /** Alias voor het boom-item. */
    public static readonly Alias: string = "TreeItem";

    /**
     * Maakt een nieuwe instantie van TreeItem aan.
     */
    public constructor() {
        super(TreeItem.Alias);
    }

    /**
     * Haalt de naam van het item op.
     * @returns {string} De naam van het item.
     */
    public name(): string {
        return "Tree";
    }

    /**
     * Geeft het type van de GameObject terug.
     * @returns {GameObjectType[]} Het type van de GameObject.
     */
    public type(): GameObjectType[] {
        return ["nonActionableItem"];
    }

    /**
     * Onderzoekt de boom en geeft een beschrijving.
     * @returns {ActionResult} Het resultaat van het onderzoeken van de boom.
     */
    public examine(): ActionResult {
        return new TextActionResult(["A tree. It looks like some of the branches are loose..."]);
    }

    /**
     * Gebruik de boom om sticks te verkrijgen.
     * @returns {ActionResult | undefined} Het resultaat van het gebruiken van de boom.
     */
    public use(): ActionResult | undefined {
        return this.obtainSticks();
    }

    /**
     * Gebruik een ander item op de boom.
     * @param {GameObject} sourceItem - Het item dat wordt gebruikt op de boom.
     * @returns {ActionResult | undefined} Het resultaat van de actie.
     */
    public useWith(sourceItem: GameObject): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        if (sourceItem.alias === "HammerItem") {
            playerSession.choppedTree = true;
            return this.obtainSticks();
        }
        return new TextActionResult(["That doesn't work on the tree."]);
    }

    /**
     * Geeft de speler 6 sticks en combineert ze direct als er ook 4 sticks in de inventory zitten.
     * @returns {ActionResult} Het resultaat van het verkrijgen van sticks.
     */
    private obtainSticks(): ActionResult {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const inventory: string[] = playerSession.inventory;

        if (!inventory.includes("6sticks")) {
            inventory.push("6sticks");
        }

        const combineMessage: ActionResult | undefined = this.combineSticks(playerSession);
        if (combineMessage) {
            return combineMessage;
        }

        return new TextActionResult([
            "You have received 6 sticks...",
            "Smoker: \"HEY!! Why did you chop that tree man...\"",
        ]);
    }

    /**
     * Controleert of de speler zowel 6 sticks als 4 sticks heeft en combineert ze tot 10 sticks.
     * @param {PlayerSession} playerSession - De sessie van de speler.
     * @returns {ActionResult | undefined} Het resultaat van de combinatie (indien succesvol).
     */
    private combineSticks(playerSession: PlayerSession): ActionResult | undefined {
        const inventory: string[] = playerSession.inventory;

        if (inventory.includes("6sticks") && inventory.includes("Sticks")) {
            // Verwijder de losse sticks
            inventory.splice(inventory.indexOf("6sticks"), 1);
            inventory.splice(inventory.indexOf("Sticks"), 1);

            // Voeg 10 sticks toe
            inventory.push("10Sticks");

            return new TextActionResult([
                "You have received 6 sticks...",
                "Smoker: \"HEY!! Why did you chop that tree man...\"",
            ]);
        }

        return undefined;
    }
}
