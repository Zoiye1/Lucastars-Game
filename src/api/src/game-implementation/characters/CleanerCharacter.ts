import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { Character } from "../../game-base/gameObjects/Character";

export class CleanerCharacter extends Character {
    public static readonly Alias: string = "cleaner";

    public constructor() {
        super(CleanerCharacter.Alias);
    }

    public name(): string {
        return "Cleaner";
    }

    public talk(choiceId?: number): ActionResult | undefined {
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
        else if (choiceId === 4) {
            return new TextActionResult(["Don't threaten me again or I will call security. Now go back to your room!"]);
        }
        else if (choiceId === 3) {
            return new TextActionResult(["I need to finish mopping the floor, but some idiot stole my water bucket from me. Help me find my bucket and I will get out of the way."]);
        }
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
