import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { Character } from "../../game-base/gameObjects/Character";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { gameService } from "../../global";
import { PlayerSession } from "../types";

// Klasse voor het GymFreak personage, dat kan worden onderzocht en waarmee gepraat kan worden
export class GymFreakCharacter extends Character implements Examine {
    public static readonly Alias: string = "GymFreak";

    public constructor() {
        super(GymFreakCharacter.Alias);
    }

    // Retourneert de naam van het personage
    public name(): string {
        return "GymFreak";
    }

    // Geeft aan dat dit object een NPC is
    public type(): GameObjectType[] {
        return ["npc"];
    }

    /**
     * Functie om met het personage te praten.
     * Afhankelijk van de keuze (choiceId) reageert de GymFreak anders.
     */
    public talk(choiceId?: number): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // Speler vraagt om hulp bij ontsnappen
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

        // Speler biedt de GymFreak steroïden aan
        if (choiceId === 3) {
            if (playerSession.inventory.includes("Steroids")) {
                playerSession.helpedGymFreak = true;
                playerSession.inventory.splice(playerSession.inventory.indexOf("steroids"), 1);
                return new TextActionResult([
                    "Thank you for the steroids! Now I'm gonna make you escape this place. Go, escape now!",
                ]);
            }
            else {
                return new TextActionResult([
                    "Haha... nice try. But without steroids, you’re not getting out of here that easy. Keep searching!",
                ]);
            }
        }

        // Reactie op andere keuzes (speler zoekt verder of verontschuldigt zich)
        else if (choiceId === 2 || choiceId === 4) {
            return new TextActionResult([
                "Okay...",
                "I will continue working out.",
            ]);
        }

        // Standaard dialoog als er geen keuze is gemaakt
        return new TalkActionResult(
            this,
            [
                "Hi, I'm very busy training.",
                "What do you want from me?",
            ],
            [
                new TalkChoice(1, "Can you help me escape?"),
                new TalkChoice(2, "Oh.. Sorry to bother you"),
            ]
        );
    }

    /**
     * Functie om de GymFreak te onderzoeken.
     * Geeft een korte beschrijving terug.
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "This is a GymFreak!",
        ]);
    }
}
