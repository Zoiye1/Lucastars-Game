import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Character } from "../../game-base/gameObjects/Character";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
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

        return new TalkActionResult(
            this,
            ["Hey, I have some stuff for sale. You want to buy something?"],
            [
                new TalkChoice(1, "What do you have for sale?"),
                new TalkChoice(2, "No, I'm not interested."),
            ]
        );
    }
}
