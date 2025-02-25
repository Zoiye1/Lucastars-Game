import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Character } from "../../game-base/gameObjects/Character";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { PlayerSession } from "../types";
import { gameService } from "../../global";

/**
 * Klasse die de dealer NPC representeert.
 * De dealer kan met de speler praten en biedt items te koop aan.
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
     * Methode waarmee de dealer met de speler kan praten.
     * Op basis van de keuze van de speler worden verschillende reacties gegeven.
     * @param _choiceId - De keuze-ID van de speler.
     * @returns Een actie resultaat met de dialoog.
     */
    public talk(_choiceId?: number): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

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

        // Reactie als speler geeft
        if (_choiceId === 5) {
            if (playerSession.inventory.includes("SugarItem")) {
                playerSession.pickedUpSugar = true;
                playerSession.inventory.push("Steroids");
                return new TextActionResult(["Amazing! Here you have Steroids."]);
            }
            else {
                return new TextActionResult(["Haha... that's not funny. You don't have powdered sugar on you. Please keep looking..."]);
            };
        }

        if (_choiceId === 2 || _choiceId === 4 || _choiceId === 6) {
            return new TextActionResult(
                [
                    "No stress",
                ]
            );
        }

        return new TalkActionResult(
            this,
            ["Hey, I have some stuff for sale. You want to buy something?"],
            [new TalkChoice(1, "What do you have for sale?"), new TalkChoice(2, "No, I'm not interested.")]
        );
    }
}
