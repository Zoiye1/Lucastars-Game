import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Character } from "../../game-base/gameObjects/Character";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Examine } from "../../game-base/actions/ExamineAction";

/**
 * Klasse die de dealer NPC representeert.
 * De dealer kan met de speler praten, biedt items te koop aan, en biedt een fetch quest aan.
 */
export class DealerCharacter extends Character implements Examine {
    /** Alias voor de dealer NPC. */
    public static readonly Alias: string = "dealer";

    public constructor() {
        super(DealerCharacter.Alias);
    }

    public name(): string {
        return "Dealer";
    }

    public type(): GameObjectType[] {
        return ["npc"];
    }

    public talk(_choiceId?: number): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // Controleer of de items al zijn gekocht
        const hasSteroids: boolean = playerSession.inventory.includes("Steroids");
        const hasCigarettes: boolean = playerSession.inventory.includes("CigarettesItem");

        // Als speler dealer aanspreekt, juiste opties en dialoog tonen
        if (_choiceId === undefined) {
            const choices: TalkChoice[] = [];
            let dialogue: string = "Hey, I have some stuff for sale. What are you interested in?";

            if (!hasSteroids) choices.push(new TalkChoice(1, "Tell me about the steroids."));
            if (!hasCigarettes) choices.push(new TalkChoice(2, "Tell me about the cigarettes."));

            if (hasSteroids && !hasCigarettes) {
                dialogue = "I only have cigarettes left for sale.";
            }
            else if (!hasSteroids && hasCigarettes) {
                dialogue = "I only have steroids left for sale.";
            }
            else if (hasSteroids && hasCigarettes) {
                return new TextActionResult(["Dealer: I don't have anything left..."]);
            }

            choices.push(new TalkChoice(10, "No, I'm not interested."));

            return new TalkActionResult(this, [dialogue], choices);
        }

        if (_choiceId === 1) {
            return new TalkActionResult(
                this,
                ["Dealer: I have some steroids for sale. You want to buy some?"],
                [
                    new TalkChoice(3, "What do I have to pay for it?"),
                    new TalkChoice(4, "No, I'm not interested."),
                ]
            );
        }

        if (_choiceId === 3) {
            return new TalkActionResult(
                this,
                ["Dealer: You have to give me powdered sugar."],
                [new TalkChoice(5, "Give powdered sugar"), new TalkChoice(6, "I don't have it right now")]
            );
        }

        if (_choiceId === 5) {
            if (playerSession.inventory.includes("SugarItem")) {
                playerSession.helpedDealer = true;
                playerSession.inventory.push("Steroids");
                playerSession.inventory.splice(playerSession.inventory.indexOf("SugarItem"), 1);
                return new TextActionResult(["Dealer: Amazing! Here you have Steroids."]);
            }
            else {
                return new TextActionResult([
                    "Dealer: Haha... that's not funny. You don't have powdered sugar on you. Please keep looking...",
                ]);
            }
        }

        if (_choiceId === 2) {
            return new TalkActionResult(
                this,
                ["I also have a pack of cigarettes for sale. Interested?"],
                [
                    new TalkChoice(7, "What do I have to pay for it?"),
                    new TalkChoice(9, "No, I'm not interested."),
                ]
            );
        }

        if (_choiceId === 7) {
            return new TalkActionResult(
                this,
                ["Dealer: That will be a nice 10 euro bill for you. Without taxes!"],
                [
                    new TalkChoice(8, "Ok, I got the cash on me. Hand me those cigs."),
                    new TalkChoice(9, "No, I'm not interested."),
                ]
            );
        }

        if (_choiceId === 8) {
            if (playerSession.inventory.includes("ten euro")) {
                playerSession.helpedDealer2 = true;
                playerSession.inventory.push("CigarettesItem");
                playerSession.inventory.splice(playerSession.inventory.indexOf("ten euro"), 1);
                return new TextActionResult(["Dealer: Amazing! Here you have the pack of cigarettes."]);
            }
            else {
                return new TextActionResult(["Dealer: Haha... that's not funny. You don't have any cash on you. Save up some cash and then come back..."]);
            }
        }

        // Speler wijst aanbod af (op elk moment)
        if (_choiceId === 4 || _choiceId === 6 || _choiceId === 9 || _choiceId === 10) {
            return new TextActionResult(["No stress."]);
        }

        return new TalkActionResult(
            this,
            ["Hey, I have some stuff for sale. What are you interested in?"],
            [
                new TalkChoice(1, "Tell me about the steroids."),
                new TalkChoice(2, "Tell me about the cigarettes."),
                new TalkChoice(10, "No, I'm not interested."),
            ]
        );
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "This is a Dealer!",
        ]);
    }
}
