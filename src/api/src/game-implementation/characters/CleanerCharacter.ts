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
                if (playerSession.inventory.includes("bucket")) {
                    playerSession.helpedCleaner = true;
                    playerSession.inventory.push("ten-euro-bill");
                    return new TextActionResult(["Amazing! Thank you for helping me. Now I can finally make my boss happy! I promised you a reward and here you go, a €10 bill. Go ahead and treat yourself with a gift :)"]);
                }
                else {
                    return new TextActionResult(["Liar! You do not have a bucket on you. Please keep looking..."]);
                };
            }

            return new TalkActionResult(
                this,
                ["Did you bring my water bucket?"],
                [
                    new TalkChoice(5, "No I am still looking for it."),
                    new TalkChoice(6, "Yes I have the bucket with me. Here you go. "),
                ]);
        }

        if (choiceId === 1) {
            return new TalkActionResult(
                this,
                ["First of all, I am doing my job! My boss will fire me if i fail to clean this cafeteria!. Maybe instead of yelling at me you can help me?"],
                [
                    new TalkChoice(3, "Relax... I am willing to help you."),
                    new TalkChoice(4, "If you don't get out of the way right now I will make a mess!"),
                ]
            );
        }
        else if (choiceId === 2) {
            return new TextActionResult(["HOW CAN YOU CALL THIS CLEAN?! IT'S A MESS BECAUSE OF YOU PEOPLE!! NOW IF YOU DON'T MIND I WILL FINISH MY JOB."]);
        }
        else if (choiceId === 3) {
            playerSession.wantsToHelpCleaner = true;

            return new TextActionResult(["I need to finish mopping the floor, but some idiot stole my water bucket from me. Help me find my bucket and I will get out of the way. You may receive a reward for your "]);
        }
        else if (choiceId === 4) {
            return new TextActionResult(["Don't threaten me again or I will call security. Now go back to your room!"]);
        }
        else {
            return new TalkActionResult(
                this,
                ["Ugh... what do you want! I need to clean the floor...!"],
                [
                    new TalkChoice(1, "Is it perhaps possible for you to get out of the way?"),
                    new TalkChoice(2, "The Cafeteria looks clean enough to me..."),
                ]
            );
        }
    }
}
