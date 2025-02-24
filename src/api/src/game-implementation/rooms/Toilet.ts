import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { BucketItem } from "../items/BucketItem";
import { Action } from "../../game-base/actions/Action";
import { PickUpAction } from "../actions/PickUpAction";
import { gameService } from "../../global";
import { PlayerSession } from "../types";
import { SimpleAction } from "../../game-base/actions/SimpleAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { DealerCharacter } from "../characters/DealerCharacters";

/**
 * Klasse die de kamer "Toilet" vertegenwoordigt.
 */
export class Toilet extends Room {
    /** Alias voor de kamer. */
    public static readonly Alias: string = "toilet";

    /**
     * Constructor voor de Toilet-klasse.
     */
    public constructor() {
        super(Toilet.Alias);
    }

    /**
     * Retourneert de naam van de kamer.
     */
    public name(): string {
        return "Toilet";
    }

    /**
     * Retourneert een lijst met afbeeldingsbestanden die bij deze kamer horen.
     */
    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["toilet/ToiletBackground", "toilet/ArrowToHallway"];

        // Controleert of de speler de emmer nog niet heeft opgepakt en voegt deze toe aan de afbeeldingen.
        if (!playerSession.pickedUpBucket) {
            result.push("toilet/Bucket");
        }

        // Voegt de dealer NPC-afbeelding toe.
        result.push("characters/Dealer");
        return result;
    }

    /**
     * Retourneert een lijst van objecten die zich in de kamer bevinden.
     */
    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [];

        // Controleert of de speler de emmer nog niet heeft opgepakt en voegt deze toe aan de objecten.
        if (!playerSession.pickedUpBucket) {
            result.push(new BucketItem());
        }

        // Voegt de dealer NPC toe aan de kamer.
        result.push(new DealerCharacter());
        return result;
    }

    /**
     * Retourneert een lijst van beschikbare acties in deze kamer.
     */
    public actions(): Action[] {
        return [
            new ExamineAction(), // Speler kan de kamer onderzoeken
            new PickUpAction(), // Speler kan objecten oppakken
            new SimpleAction("enter-hallway", "Enter the Hallway"), // Actie om de hal binnen te gaan
            new TalkAction(), // Speler kan praten met NPC's
        ];
    }

    /**
     * Verwerkt eenvoudige acties die door de speler worden uitgevoerd.
     * @param alias - De alias van de actie.
     * @returns Het resultaat van de actie.
     */
    public simpel(alias: string): ActionResult | undefined {
        if (alias === "enter-hallway") {
            const room: Room = new Hallway();

            // Wijzigt de huidige kamer van de speler naar de hal
            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }

        return new TextActionResult(["You can't go there."]);
    }

    /**
     * Retourneert de beschrijving van de kamer wanneer de speler deze onderzoekt.
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["It's a toilet."]);
    }
}
