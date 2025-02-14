import { Examine } from "../../game-base/actions/ExamineAction";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { Character } from "../../game-base/gameObjects/Character";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { gameService } from "../../global";

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
                    "Cook: \"Huh?\" \"Thats the door to the storage.\"",
                ],
                [
                    new TalkChoice (3, "\"Can you open it for me?\""),
                    new TalkChoice (4, "\"What's in there?\""),
                ]
            );
        }
        if (choiceId === 2) {
            return new TalkActionResult(
                this,
                [
                    "Cook: \"Im trying to prepare the meals but I'm short of some suplies...\"",
                ],
                [
                    new TalkChoice (5, "\"Maybe I can help you?\""),
                    new TalkChoice (6, "\"goodluck with that...\" (Ends conversation)"),
                ]
            );
        }
        if (choiceId === 3) {
            if (gameService.getPlayerSession().GaveTheForkToCook) {
                return new TextActionResult(

                    [
                        "Cook: \"Yeah sure, here take this key. It opens the door\"", "The Cook hands you a key",
                    ]
                );
            }
            return new TextActionResult(

                [
                    "Cook: \"Honestly I'm a little busy.\"", "The Cook turns back to his work",
                ]
            );
        }
        if (choiceId === 4) {
            return new TextActionResult(
                [
                    "Cook: \"I don't know the doctors wont allow me back there...\"",
                    "The Cook turns back to his work",
                ]
            );
        }
        if (choiceId === 5) {
            return new TalkActionResult(
                this,
                [
                    "Cook: \"Well if you really want to help me, im trying to prepare a diner but I'm missing a Fork\"",
                    "Cook: \"If you could find it for me that would be a massive help!\"",
                ],
                [
                    new TalkChoice (7, "\"I'll see what I can do I guess.\""),
                    new TalkChoice (8, "\"Actually I already have a fork.\""),
                ]
            );
        }
        if (choiceId === 8) {
            gameService.getPlayerSession().GaveTheForkToCook = true;
            return new TextActionResult(
                [
                    "Cook: \"Oh thank you! You're a life saver!\"", "If theres anything I can do for you just ask me!",
                ]
            );
        }
        return new TalkActionResult(
            this, [
                "The Cook seems like he's busy trying to prepare a meal.",
            ],
            [
                new TalkChoice(1, "\"Hey what's behind the door?\""),
                new TalkChoice(2, "\"What are you doing\"?"),
            ]
        );
    }
}
