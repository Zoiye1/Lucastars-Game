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
import { TalkAction } from "../../game-base/actions/TalkAction";
import { DealerCharacter } from "../characters/DealerCharacters";
import { AirFreshenerItem } from "../items/AirFreshenerItem";
import { Arrowroom, ClickItem } from "@shared/types";

/**
 * Klasse die de kamer "Toilet" vertegenwoordigt.
 */
export class ToiletRoom extends Room {
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
    public type(): GameObjectType[] {
        return ["room"];
    }

    /**
     * Retourneert een lijst met afbeeldingsbestanden die bij deze kamer horen.
     */
    public images(): string[] {
        const result: string[] = ["toilet/ToiletBackground"];

        // Controleert of de speler de emmer nog niet heeft opgepakt en voegt deze toe aan de afbeeldingen.
        // if (!playerSession.pickedUpBucket) {
        //     result.push("toilet/Bucket");
        // }

        // Controleert of de speler de luchtverfrisser nog niet heeft opgepakt en voegt deze toe aan de afbeeldingen.
        // if (!playerSession.pickedUpAirFreshener) {
        //     result.push("toilet/AirFreshener");
        // }

        // Voegt de dealer NPC-afbeelding toe.
        // result.push("characters/Dealer");
        return result;
    }

    public ClickItem(): ClickItem[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // Always give 4 paramaters for Click objects: The name (will be displayed), alias,
        // The imageurl and the types

        // result as an array of ClickItem objects
        const result: ClickItem[] = [
            { name: "Air Freshener", alias: "AirFreshenerItem", imageUrl: "toilet/AirFreshener", type: ["actionableItem"], imageCoords: { x: 5, y: 31 } },
        ];

        if (!playerSession.pickedUpAirFreshener) {
            result.push({ name: "Dealer", alias: "dealer", imageUrl: "characters/Dealer", type: ["npc"], imageCoords: { x: 60, y: 52 }}
            );
        }

        if (!playerSession.pickedUpBucket) {
            result.push({ name: "Bucket", alias: "bucket", imageUrl: "toilet/Bucket", type: ["actionableItem"], imageCoords: { x: 45, y: 80 } });
        }

        console.log("ClickItem() output:", result);

        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Hallway", alias: "hallway", imageRotation: 90, imageCoords: { x: 78, y: 60 } },
        ];

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

        if (!playerSession.pickedUpAirFreshener) {
            result.push(new AirFreshenerItem());
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
            // Speler kan praten met NPC's
            new TalkAction(),
        ];
    }

    /**
     * Verwerkt eenvoudige acties die door de speler worden uitgevoerd.
     * @param alias - De alias van de actie.
     * @returns Het resultaat van de actie.
     */

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
