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
import { PlaceAction } from "../actions/PlaceAction";
import { BombItem } from "../items/BombItem";

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
        const playerSession: PlayerSession = gameService.getPlayerSession();

        if (playerSession.placedBomb) {
            result.push("gif/ToiletEnding");
        }

        return result;
    }

    public ClickItem(): ClickItem[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // Always give 4 paramaters for Click objects: The name (will be displayed), alias,
        // The imageurl and the types

        // result as an array of ClickItem objects
        const result: ClickItem[] = [];

        if (!playerSession.placedBomb) {
            result.push({
                name: "Dealer",
                alias: "dealer",
                imageUrl: "gif/Dealer",
                type: ["npc"],
                imageCoords: { x: 20, y: 40 },
            });
        }

        {
            if (!playerSession.pickedUpAirFreshener) {
                result.push({
                    name: "AirFreshener",
                    alias: "AirFreshenerItem",
                    imageUrl: "toilet/AirFreshener",
                    type: ["actionableItem"],
                    imageCoords: { x: 2, y: 82 },
                });
            }

            if (!playerSession.pickedUpBucket) {
                result.push({
                    name: "Bucket",
                    alias: "bucket",
                    imageUrl: "toilet/Bucket",
                    type: ["actionableItem"],
                    imageCoords: { x: 45, y: 78 },
                });
            }

            // console.log("ClickItem() output:", result);

            return result;
        }
    }

    public ArrowUrl(): Arrowroom[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: Arrowroom[] = [];

        if (!playerSession.placedBomb) {
            // Hallway-pijl is alleen zichtbaar als de bom nog NIET is geplaatst
            result.push({ name: "Hallway", alias: "hallway", imageRotation: 90, imageCoords: { x: 82, y: 83 } });
        }

        if (playerSession.placedBomb) {
            // Escape-pijl wordt zichtbaar zodra de bom is geplaatst
            result.push({ name: "Escape", alias: "toilet-end", imageRotation: -90, imageCoords: { x: 5, y: 60 } });
        }

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

        if (playerSession.inventory.includes("BombItem") && !playerSession.placedBomb) {
            result.push(new BombItem());
        }

        // playerSession.placedBomb = true;

        console.log("ToiletRoom - placedBomb check in images:", playerSession.placedBomb);

        // Voegt de dealer NPC toe aan de kamer.
        result.push(new DealerCharacter());
        return result;
    }

    /**
     * Retourneert een lijst van beschikbare acties in deze kamer.
     */
    public actions(): Action[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        const result: Action[] = [
            // Speler kan de kamer onderzoeken
            new ExamineAction(),
            // Speler kan objecten oppakken
            new PickUpAction(),
            // Speler kan praten met NPC's
            new TalkAction(),
        ];

        if (playerSession.inventory.includes("BombItem") && !playerSession.placedBomb) {
            result.push(new PlaceAction());
            console.log("ToiletRoom - PlaceAction available:", !playerSession.placedBomb);
        }

        return result;
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
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (playerSession.inventory.includes("BombItem")) {
            return new TextActionResult([
                "The bomb you made would probably work here!",
            ]);
        }
        else {
            return new TextActionResult([
                "You step into the bathroom, the stink of dampness hits you right away.",
                "In the middle of the room stands a shady figure—it's clear they're here for business.",
                "You wonder if this is someone who can help... or make things worse.",
            ]);
        }
    }
}
