import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Character } from "../../game-base/gameObjects/Character";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { gameService } from "../../global";
import { Toilet } from "../rooms/Toilet";
// import { PlayerSession } from "../types";
import { TalkChoice } from "../../game-base/actions/TalkAction";

export class DealerCharacter extends Character {
    public static readonly Alias: string = "dealer";

    public constructor() {
        super(DealerCharacter.Alias);
    }

    public name(): string {
        return "Dealer";
    }

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

        if (_choiceId === 5) {
            return new TalkActionResult(
                this,
                ["Thanks! Here is your steroids."], // Reactie als speler geeft
                []
            );
        }

        if (_choiceId === 6 || _choiceId === 2 || _choiceId === 4) {
            gameService.getPlayerSession().currentRoom = Toilet.Alias; // Speler blijft in de toilet
            const room = new Toilet(); // Nieuwe instantie van de kamer

            return room.examine(); // Toont direct weer "It's a toilet."
        }

        return new TalkActionResult(
            this,
            ["Hey, I have some stuff for sale. You want to buy something?"],
            [new TalkChoice(1, "What do you have for sale?"), new TalkChoice(2, "No, I'm not interested.")]
        );
    }
}
