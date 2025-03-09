import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Character } from "../../game-base/gameObjects/Character";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

/**
 * Klasse die de dealer NPC representeert.
 * De dealer kan met de speler praten en biedt een fetch quest aan.
 */
export class DealerCharacter extends Character {
    /** Alias voor de dealer NPC. */
    public static readonly Alias: string = "dealer";

    /**
     * Constructor voor de DealerCharacter-klasse.
     */
    public constructor() {
        super(DealerCharacter.Alias);
    }

    /**
     * Retourneert de naam van het personage.
     */
    public name(): string {
        return "Dealer";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["npc"];
    }

    /**
     * Methode waarmee de dealer met de speler kan praten.
     * Op basis van de keuze van de speler worden verschillende reacties gegeven.
     * @param _choiceId - De keuze-ID van de speler.
     * @returns Een actie resultaat met de dialoog.
     */
    public talk(_choiceId?: number): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // Start een fetch quest
        if (_choiceId === 7) {
            return new TextActionResult([
                "I need you to find a water bucket and bring it to the cleaner.",
                "Let me know when you have it!",
            ]);
        }

        // Controleer of speler het vereiste item heeft
        if (_choiceId === 8) {
            if (playerSession.inventory.includes("WaterBucket")) {
                return new TextActionResult([
                    "Thank you for bringing the water bucket to the cleaner!",
                    "Here is your reward.",
                ]);
            }
            else {
                return new TextActionResult(["You don't have the water bucket yet. Please keep looking!"]);
            }
        }

        // Standaard dialoog
        return new TalkActionResult(
            this,
            ["Hey, I have some stuff for sale. You want to buy something?"],
            [
                new TalkChoice(1, "What do you have for sale?"),
                new TalkChoice(2, "No, I'm not interested."),
                new TalkChoice(7, "Do you have any tasks for me?"),
                new TalkChoice(8, "I found the water bucket!"),
            ]
        );
    }
}
