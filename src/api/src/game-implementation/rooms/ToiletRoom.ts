import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { BucketItem } from "../items/BucketItem";
import { Action } from "../../game-base/actions/Action";
import { PickUpAction } from "../actions/PickUpAction";
import { gameService } from "../../global";
import { PlayerSession } from "../types";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { DealerCharacter } from "../characters/DealerCharacters";
import { HallwayRoom } from "./HallwayRoom";

/**
 * Klasse die de kamer "Toilet" vertegenwoordigt.
 */
export class ToiletRoom extends Room implements Simple {
    /** Alias voor de kamer. */
    public static readonly Alias: string = "toilet";

    /**
     * Constructor voor de Toilet-klasse.
     */
    public constructor() {
        super(ToiletRoom.Alias);
    }

    /**
     * Retourneert de naam van de kamer.
     */
    public name(): string {
        return "Toilet";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType {
        return "room";
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
            // Speler kan de kamer onderzoeken
            new ExamineAction(),
            // Speler kan objecten oppakken
            new PickUpAction(),
            // Actie om de hal binnen te gaan
            new SimpleAction("enter-hallway", "Enter the Hallway"),
            // Speler kan praten met NPC's
            new TalkAction(),
        ];
    }

    /**
     * Verwerkt eenvoudige acties die door de speler worden uitgevoerd.
     * @param alias - De alias van de actie.
     * @returns Het resultaat van de actie.
     */
    public simple(alias: string): ActionResult | undefined {
        if (alias === "enter-hallway") {
            const room: Room = new HallwayRoom();

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
        return new TextActionResult(["You step into the bathroom, the stink of dampness hits you right away.",
            "In the middle of the room stands a shady figure—it's clear they're here for business.",
            "You wonder if this is someone who can help... or make things worse.",
        ]);
    }
}
