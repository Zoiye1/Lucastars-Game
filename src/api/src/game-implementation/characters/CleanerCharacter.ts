import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { Character } from "../../game-base/gameObjects/Character";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { gameService } from "../../global";
import { PlayerSession } from "../types";

/**
 * Class die de karakter "Cleaner" representeert.
 *
 * Deze karakter kan met de speler praten en heeft een taak die moet worden voltooid.
 */
export class CleanerCharacter extends Character implements Examine {
    /** Alias die wordt gebruikt om de cleaner te identificeren */
    public static readonly Alias: string = "cleaner";

    public constructor() {
        super(CleanerCharacter.Alias);
    }

    /**
     * Geeft de naam van de cleaner terug
     *
     * @returns De naam van de karakter
     */
    public name(): string {
        return "Cleaner";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "This is a cleaner!",
        ]);
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["npc"];
    }

    /**
     * Voert een gesprek met de cleaner op basis van de keuze van de speler.
     *
     * @param choiceId - De id van de keuze die de speler heeft gemaakt (optioneel)
     * @returns Een ActionResult gebaseerd op de keuze van de speler of undefined als er geen relevante actie is
     */
    public talk(choiceId?: number): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        if (!playerSession.wantsToHelpCleaner) {
            if (choiceId !== 1 && choiceId !== 2 && choiceId !== 3 && choiceId !== 4 && choiceId !== 5 && choiceId !== 6) {
                return new TalkActionResult(
                    this,
                    ["Cleaner: Oh, hi. Sorry, I am a little busy trying to clean up."],
                    [
                        new TalkChoice(1, "The cafeteria looks fine to me."),
                        new TalkChoice(2, "Would you mind moving out of the way?"),
                    ]
                );
            }
            else if (choiceId === 1) {
                return new TextActionResult(["Cleaner: I appreciate that, but I still have so much to do... I'd be almost done by now, but I am missing something..."]);
            }
            else if (choiceId === 2) {
                return new TalkActionResult(
                    this,
                    ["Cleaner: I really wish I could, but I have to finish cleaning. My boss is expecting me to get this done. If you’d like, I could use a little help."],
                    [
                        new TalkChoice(3, "Sure, I'd be happy to help."),
                        new TalkChoice(4, "Come on, just move aside already."),
                    ]
                );
            }
            else if (choiceId === 3) {
                return new TalkActionResult(
                    this,
                    ["Cleaner: Thank you! I just need my water bucket, but someone took it. If you can help me find it, I would really appreciate it, and I might have something for you in return."],
                    [
                        new TalkChoice(5, "Okay, I will go look for it!"),
                        new TalkChoice(6, "Actually, I already have the bucket! Here you go."),
                    ]
                );
            }
            else if (choiceId === 4) {
                return new TextActionResult(["Cleaner: Don't talk to me like that... I am already exhausted!"]);
            }
            else if (choiceId === 5) {
                playerSession.wantsToHelpCleaner = true;
                return new TextActionResult(["Cleaner: Thank you for trying to help. Goodluck :)"]);
            }
            else {
                // choideId 6
                if (playerSession.inventory.includes("bucket")) {
                    playerSession.helpedCleaner = true;
                    playerSession.inventory.push("ten-euro-bill");
                    playerSession.inventory.splice(playerSession.inventory.indexOf("bucket"), 1);
                    return new TextActionResult(["Cleaner: Amazing! Thank you for helping me. Now I can finally make my boss happy! I promised you a reward and here you go, a €10 bill. Go ahead and treat yourself with a gift :)"]);
                }
                else {
                    return new TextActionResult(["Cleaner: Haha.. that's not funny. You do not have a bucket on you. Please keep looking..."]);
                };
            }
        }
        else {
            if (choiceId !== 7 && choiceId !== 8) {
                return new TalkActionResult(
                    this,
                    ["Cleaner: Did you manage to find my water bucket?"],
                    [
                        new TalkChoice(7, "Not yet, I am still looking."),
                        new TalkChoice(8, "Yes, I found it! Here you go. "),
                    ]);
            }
            else if (choiceId === 7) {
                return new TextActionResult(["Cleaner: Okay. I will be waiting here."]);
            }
            else {
                // choiceId == 8
                if (playerSession.inventory.includes("bucket")) {
                    playerSession.helpedCleaner = true;
                    playerSession.inventory.push("ten-euro-bill");
                    playerSession.inventory.splice(playerSession.inventory.indexOf("bucket"), 1);
                    return new TextActionResult(["Cleaner: Amazing! Thank you for helping me. Now I can finally make my boss happy! I promised you a reward and here you go, a €10 bill. Go ahead and treat yourself with a gift :)"]);
                }
                else {
                    return new TextActionResult(["Cleaner: Haha.. that's not funny. You do not have a bucket on you. Please keep looking..."]);
                };
            }
        }
    }
}
