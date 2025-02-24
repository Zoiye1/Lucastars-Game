import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Character } from "../../game-base/gameObjects/Character";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { gameService } from "../../global";
import { Toilet } from "../rooms/ToiletRoom";

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
                [new TalkChoice(5, "Give"), new TalkChoice(6, "I don't have it right now")]
            );
        }

        // Reactie als speler geeft
        if (_choiceId === 5) {
            return new TalkActionResult(
                this,
                ["Thanks! Here is your steroids."],
                []
            );
        }

        if (_choiceId === 6 || _choiceId === 2 || _choiceId === 4) {
            // Speler blijft in de toilet na het gesprek
            gameService.getPlayerSession().currentRoom = Toilet.Alias;

            // Nieuwe instantie van de kamer
            const room = new Toilet();

            // Toont direct weer "It's a toilet."
            return room.examine();
        }

        return new TalkActionResult(
            this,
            ["Hey, I have some stuff for sale. You want to buy something?"],
            [new TalkChoice(1, "What do you have for sale?"), new TalkChoice(2, "No, I'm not interested.")]
        );
    }
}
