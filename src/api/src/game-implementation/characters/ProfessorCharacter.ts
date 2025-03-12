import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { Character } from "../../game-base/gameObjects/Character";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { PlayerSession } from "../types";
import { gameService } from "../../global";

export class ProfessorCharacter extends Character {
    public static Alias: string = "Professor";

    public constructor() {
        super(ProfessorCharacter.Alias);
    }

    public name(): string {
        return "Professor";
    }

    /**
    * Geeft de type van de GameObject terug
    *
    * @returns De type van de GameObject (GameObjectType union)
    */
    public type(): GameObjectType[] {
        return ["npc"];
    }

    public talk(choiceId?: number): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // Handle specific choices
        if (choiceId === 1) {
            return new TalkActionResult(
                this,
                [
                    "Alright, lets get to work then. Your first task: Can you find my glass beaker for me?I cant seem to find it",
                ],
                [
                    new TalkChoice(3, "Sure, i will go look for it..."),
                    new TalkChoice(4, "I found it already, here you go!"),
                ]
            );
        }

        if (choiceId === 2) {
            return new TextActionResult(["Get out of here before i call security!!"]);
        }

        if (choiceId === 3) {
            playerSession.wantsToSearchGlassBeaker = true;
            return new TextActionResult(["Goodluck!"]);
        }

        if (choiceId === 4) {
            if (playerSession.inventory.includes("GlassBeakerItem")) {
                playerSession.wantsToSearchIngredients = true;
                return new TextActionResult(["Perfect! But we still need the ingredients... Find: SulfuricAcid, FocusDrink, Baking Soda"]);
            }
            else {
                return new TextActionResult(["Is this a joke... keep looking before i find a new assistant."]);
            }
        }

        if (choiceId === 5) {
            return new TextActionResult(["Have you tried looking in the lab? It might still be laying around here"]);
        }

        if (choiceId === 6) {
            return new TextActionResult(["Find: SulfuricAcid, FocusDrink, Baking Soda"]);
        }

        if (choiceId === 7) {
            if (playerSession.inventory.includes("FocusDrinkItem") &&
              playerSession.inventory.includes("SulfuricAcidItem") &&
              playerSession.inventory.includes("BakingSodaItem")) {
                playerSession.inventory.splice(playerSession.inventory.indexOf("FocusDrinkItem"), 1);
                playerSession.inventory.splice(playerSession.inventory.indexOf("SulfuricAcidItem"), 1);
                playerSession.inventory.splice(playerSession.inventory.indexOf("BakingSodaItem"), 1);

                playerSession.inventory.push("CorrosiveAcid");
                playerSession.helpedProfessor = true;
                return new TextActionResult(["Perfect, here you go +1 CorrosiveAcid"]);
            }
            else {
                return new TextActionResult(["You dont have all items yet, keep searching."]);
            }
        }

        // Default conversation (when no choiceId is provided)
        if (choiceId === undefined) {
            if (playerSession.wantsToSearchIngredients) {
                return new TalkActionResult(
                    this,
                    [
                        "Have you found the ingredients?",
                    ],
                    [
                        new TalkChoice(6, "What ingredients do we need again?"),
                        new TalkChoice(7, "Yeah i collected them all."),
                    ]
                );
            }
            else if (playerSession.wantsToSearchGlassBeaker) {
                return new TalkActionResult(
                    this,
                    [
                        "Have you found my Glass Beaker?",
                    ],
                    [
                        new TalkChoice(4, "Yeah i found it, here you go!"),
                        new TalkChoice(5, "I cant seem to find it..."),
                    ]
                );
            }
            else {
                return new TalkActionResult(
                    this,
                    [
                        "Who are you... are you my new assistant or something?",
                    ],
                    [
                        new TalkChoice(1, "Yeah thats right, i am here to help you!"),
                        new TalkChoice(2, "Nah i just sneaked in, im actually a prisoner..."),
                    ]
                );
            }
        }

        return undefined;
    }
}
