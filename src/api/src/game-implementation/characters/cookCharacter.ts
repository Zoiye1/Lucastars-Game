import { Examine } from "../../game-base/actions/ExamineAction";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { Character } from "../../game-base/gameObjects/Character";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";

export class cookCharacter extends Character implements Examine {
    public static readonly Alias: string = "cook";

    public constructor() {
        super(cookCharacter.Alias);
    }

    public name(): string {
        return "Cook";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "This is a cook!",
        ]);
    }

    public talk(choiceId?: number): ActionResult | undefined {
        if (choiceId === 1) {
            return new TalkActionResult(
                this,
                [
                    "Yeah I'm the cook",
                ],
                [
                    new TalkChoice (3, "thats nice!"),
                ]
            );
        }
        if (choiceId === 2) {
            return new TextActionResult([
                "You're in the hospital",
            ]);
        }
        return new TalkActionResult(
            this, [
                "hi, im the cook.",
            ],
            [
                new TalkChoice(1, "Hey are you the cook?"),
                new TalkChoice(2, "Where am I?"),
            ]
        );
    }
}
