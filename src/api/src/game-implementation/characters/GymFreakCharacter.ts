import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { Character } from "../../game-base/gameObjects/Character";
import { gameService } from "../../global";
import { PlayerSession } from "../types";

export class GymFreakCharacter extends Character {
    public static readonly Alias: string = "GymFreak";

    public constructor() {
        super(GymFreakCharacter.Alias);
    }

    public name(): string {
        return "GymFreak";
    }

    public talk(choiceId?: number): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (choiceId === 1) {
            return new TalkActionResult(
                this,
                [
                    "I could help you, but I need something from you.",
                    "If you could give me steroids, then I will help you escape.",
                ],
                [
                    new TalkChoice(3, "I have steroids, take it."),
                    new TalkChoice(4, "I'm gonna search for it."),
                ]
            );
        }

        if (choiceId === 3) {
            if (playerSession.inventory.includes("Steroids")) {
                playerSession.helpedGymFreak = true;
                return new TextActionResult(["Thank you for the steroids! Now I'm gonna make you escape this place. Go, escape now!"]);
            }
            else {
                return new TextActionResult(["Haha... nice try. But without steroids, you’re not getting out of here that easy. Keep searching!"]);
            };
        }

        else if (choiceId === 2 || choiceId === 4) {
            return new TextActionResult(["Okay...",
                "I will continue working out.",
            ]);
        }

        return new TalkActionResult(
            this,
            [
                "Hi, im very busy training",
                "What do you want from me?",
            ],
            [
                new TalkChoice(1, "Can you help me escape?"),
                new TalkChoice(2, "Oh.. Sorry to bother you"),
            ]
        );
    }
}
