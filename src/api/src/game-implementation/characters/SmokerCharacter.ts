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
 * Class die de karakter "Smoker" representeert.
 *
 * Deze karakter kan met de speler praten en heeft een taak die moet worden voltooid.
 */
export class SmokerCharacter extends Character implements Examine {
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

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "You see a man smoking in the courtyard.",
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

    public talk(choiceId?: number): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        if (!playerSession.tradedWithSmoker) {
            if (choiceId !== 1 && choiceId !== 2 && choiceId !== 3 && choiceId !== 4) {
                return new TalkActionResult(
                    this,
                    ["Smoker: Ayo my G, why do people keep chopping that tree man? Anyways, I got a sweet deal for ya! Tryna make this happen?",
                        "See here's the ting... I'm dry on cigs but holdin' lighters.",
                        "You front me some smokes, I'll bless you with fire. Sounds good my g?"],
                    [
                        new TalkChoice(1, "We can work somethin out fo sho."),
                        new TalkChoice(2, "Nah I'm straight, G."),
                    ]
                );
            }
            else if (choiceId === 1) {
                return new TalkActionResult(
                    this,
                    ["Smoker: Fo sho? Look here... you bring me a pack of cigs, and...",
                        "I'll trade you this premium lighter. That's the family discount right there."],
                    [
                        new TalkChoice(3, "Got you those good cigs my man."),
                        new TalkChoice(4, "I'ma see what I can scrape up."),
                    ]
                );
            }
            else if (choiceId === 2) {
                return new TextActionResult(["Smoker: Aight, your loss playa. I'll be here puffin on hopes and dreams."]);
            }
            else if (choiceId === 3) {
                if (playerSession.inventory.includes("CigarettesItem")) {
                    playerSession.inventory.splice(playerSession.inventory.indexOf("CigarettesItem"), 1);

                    playerSession.inventory.push("LighterItem");
                    playerSession.tradedWithSmoker = true;
                    playerSession.helpedSmoker = true;

                    return new TextActionResult(["Smoker: *snaps fingers* Aight, aight... thats wassup!",
                        "Here's that lighter fam... don't smoke it all in one place!"]);
                }
                else {
                    return new TextActionResult(["Smoker: You tryna finesse me?! Where my cigs at? Hurry up dawg",
                        "Come back with the stuff or keep it pushin"]);
                }
            }
            else {
                return new TextActionResult(["Smoker: No doubt, no doubt. Clock's tickin though... don't leave me hangin."]);
            }
        }
        else {
            return new TextActionResult(["Smoker: We locked in already homie! That lighter better be treatin you right!"]);
        }
    }
}
