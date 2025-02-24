import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { Character } from "../../game-base/gameObjects/Character";
import { gameService } from "../../global";
import { PlayerSession } from "../types";

export class CleanerCharacter extends Character {
    public static readonly Alias: string = "cleaner";

    public constructor() {
        super(CleanerCharacter.Alias);
    }

    public name(): string {
        return "Cleaner";
    }

    public talk(choiceId?: number): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        console.log(choiceId, playerSession.wantsToHelpCleaner);
        if (playerSession.wantsToHelpCleaner) {
            if (choiceId === 5) {
                return new TextActionResult(["Okay. I will be waiting here."]);
            }
            else if (choiceId === 6) {
                playerSession.inventory.push("bucket");
                if (playerSession.inventory.includes("bucket")) {
                    playerSession.helpedCleaner = true;
                    playerSession.inventory.push("ten-euro-bill");
                    return new TextActionResult(["Amazing! Thank you for helping me. Now I can finally make my boss happy! I promised you a reward and here you go, a €10 bill. Go ahead and treat yourself with a gift :)"]);
                }
                else {
                    return new TextActionResult(["Haha.. you think you are funny?! You do not have a bucket on you. Please keep looking..."]);
                };
            }

            return new TalkActionResult(
                this,
                ["Did you manage to find my water bucket?"],
                [
                    new TalkChoice(5, "Not yet, I am still looking."),
                    new TalkChoice(6, "Yes, I found it! Here you go. "),
                ]);
        }

        if (choiceId === 1) {
            return new TalkActionResult(
                this,
                ["I really wish I could, but I have to finish cleaning. My boss is expecting me to get this done. If you’d like, I could use a little help."],
                [
                    new TalkChoice(3, "Sure, I'd be happy to help."),
                    new TalkChoice(4, "Come on, just move aside already."),
                ]
            );
        }
        else if (choiceId === 2) {
            return new TextActionResult(["I appreciate that, but I still have so much to do... I'd be almost done by now, but I am missing something..."]);
        }
        else if (choiceId === 3) {
            playerSession.wantsToHelpCleaner = true;

            return new TextActionResult(["Thank you! I just need my water bucket, but someone took it. If you can help me find it, I would really appreciate it, and I might have something for you in return."]);
        }
        else if (choiceId === 4) {
            return new TextActionResult(["Don't talk to me like that... I am already exhausted!"]);
        }
        else {
            return new TalkActionResult(
                this,
                ["Oh, hi. Sorry, I am a little busy trying to clean up."],
                [
                    new TalkChoice(1, "Would you mind moving out of the way?"),
                    new TalkChoice(2, "The cafeteria looks fine to me."),
                ]
            );
        }
    }
}
