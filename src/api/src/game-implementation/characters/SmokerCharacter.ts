import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { Character } from "../../game-base/gameObjects/Character";
import { gameService } from "../../global";
import { PlayerSession } from "../types";

/**
 * Class die de karakter "Smoker" representeert.
 *
 * Deze karakter kan met de speler praten en heeft een taak die moet worden voltooid.
 */
export class SmokerCharacter extends Character {
    /** Alias die wordt gebruikt om de smoker te identificeren */
    public static readonly Alias: string = "smoker";

    public constructor() {
        super(SmokerCharacter.Alias);
    }

    /**
     * Geeft de naam van de Smoker terug
     *
     * @returns De naam van de karakter
     */
    public name(): string {
        return "Smoker";
    }

    public talk(choiceId?: number): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // If player hasn't traded yet
        if (!playerSession.tradedWithSmoker) {
            if (choiceId !== 1 && choiceId !== 2 && choiceId === 3) {
                return new TalkActionResult(
                    this,
                    ["Hey, you got a light? Oh wait, never mind... I lost my lighter."],
                    [
                        new TalkChoice(1, "I don’t, but maybe I can help."),
                        new TalkChoice(2, "Not my problem."),
                    ]
                );
            }
            else if (choiceId === 1) {
                return new TalkActionResult(
                    this,
                    ["Well, if you can get me a lighter, I’d appreciate it. But I’m also willing to trade if you have a 10-euro bill."],
                    [
                        new TalkChoice(3, "I have a 10-euro bill, let’s trade."),
                        new TalkChoice(4, "I’ll see what I can do."),
                    ]
                );
            }
            else if (choiceId === 2) {
                return new TextActionResult(["Alright, whatever."]);
            }
            else if (choiceId === 3) {
                if (playerSession.inventory.includes("ten-euro-bill")) {
                // Remove the bill and give the lighter
                    playerSession.inventory.splice(playerSession.inventory.indexOf("ten-euro-bill"), 1);
                    playerSession.inventory.push("lighter");
                    playerSession.tradedWithSmoker = true;

                    return new TextActionResult(["Pleasure doing business with you. Here's your lighter."]);
                }
                else {
                    return new TextActionResult(["Uh... you don’t even have a 10-euro bill. Come back when you do."]);
                }
            }
            else {
                return new TextActionResult(["Alright, let me know if you find a lighter for me."]);
            }
        }
        else {
            return new TextActionResult(["We already traded. Enjoy your lighter."]);
        }
    }
}
