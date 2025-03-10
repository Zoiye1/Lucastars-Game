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
 * De dealer kan met de speler praten, biedt items te koop aan, en biedt een fetch quest aan.
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

        // Fetch quest voor de water bucket
        if (_choiceId === 7) {
            return new TextActionResult([
                "I need you to find a water bucket and bring it to the cleaner.",
                "Let me know when you have it!",
            ]);
        }

        // Controleer of speler het vereiste item heeft voor de fetch quest
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

        // Interactie voor het kopen van items (steroïden)
        if (_choiceId === 1) {
            return new TalkActionResult(
                this,
                ["I have some steroids for sale. You want to buy some?"],
                [
                    new TalkChoice(3, "What do I have to pay for it?"),
                    new TalkChoice(4, "No, I'm not interested."),
                ]
            );
        }

        if (_choiceId === 3) {
            return new TalkActionResult(
                this,
                ["You have to give me powdered sugar."],
                [new TalkChoice(5, "Give powdered sugar"), new TalkChoice(6, "I don't have it right now")]
            );
        }

        // Reactie als speler de suiker geeft
        if (_choiceId === 5) {
            if (playerSession.inventory.includes("SugarItem")) {
                playerSession.pickedUpSugar = true;
                playerSession.inventory.push("Steroids");
                return new TextActionResult(["Amazing! Here you have Steroids."]);
            }
            else {
                return new TextActionResult(["Haha... that's not funny. You don't have powdered sugar on you. Please keep looking..."]);
            }
        }

        // Reacties voor andere keuzes
        if (_choiceId === 2 || _choiceId === 4 || _choiceId === 6) {
            return new TextActionResult([
                "No stress",
            ]);
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
