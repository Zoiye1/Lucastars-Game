import { Arrowroom, ClickItem } from "@shared/types";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { HammerItem } from "../items/HammerItem";
import { SticksItem } from "../items/SticksItem";
import { PlayerSession } from "../types";
import { UseAction } from "../actions/UseAction";
import { RoofItem } from "../items/RoofItem";
// import { RoofEndRoom } from "./RoofEndRoom";

export class RoofRoom extends Room {
    // Unieke alias voor deze kamer, gebruikt voor identificatie
    public static readonly Alias: string = "roof";

    public constructor() {
        super(RoofRoom.Alias);
    }

    // Geeft de naam van de kamer terug, gebruikt in de UI of logsF
    public name(): string {
        return "Roof";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["room"];
    }

    // Bepaalt welke afbeeldingen in deze kamer zichtbaar zijn
    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // const playerSession: PlayerSession = gameService.getPlayerSession();
        // const inventory: string[] = playerSession.inventory;
        const result: string[] = ["Roof/RoofBackground"];

        if (playerSession.EscapedRoof)
            result.push("Roof/RoofEscaping");

        // // Voeg de hamer toe aan de afbeeldingen als deze nog niet is opgepakt
        // if (!playerSession.pickedUpHammer) {
        //     result.push("Roof/Hammer");
        // }

        // // Voeg de stokken toe aan de afbeeldingen als deze nog niet zijn opgepakt
        // if (!inventory.includes("Sticks") && !inventory.includes("10Sticks")) {
        //     result.push("Roof/Sticks");
        // }

        return result;
    }

    public ClickItem(): ClickItem[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const inventory: string[] = playerSession.inventory;
        // Always give 4 paramaters for Click objects: The name (will be displayed), alias,
        // The imageurl and the types

        // result as an array of ClickItem objects
        const result: ClickItem[] = [
        ];
        if (!playerSession.pickedUpHammer) {
            result.push({ name: "Hammer", alias: "HammerItem", imageUrl: "Roof/Hammer", type: ["actionableItem"], imageCoords: { x: 55, y: 46 } });
        }
        if (!inventory.includes("Sticks") && !inventory.includes("10Sticks")) {
            result.push({ name: "Sticks", alias: "Sticks", imageUrl: "Roof/Sticks", type: ["actionableItem"], imageCoords: { x: 25, y: 84 } });
        }

        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "vent", alias: "Vents", imageRotation: -90, imageCoords: { x: 10, y: 60 } },

        ];
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // Only add the arrow is the player actually opened the door
        if (playerSession.EscapedRoof) {
            result.push(
                { name: "Escape", alias: "RoofEndRoom", imageRotation: 90, imageCoords: { x: 80, y: 50 } }
            );
        }

        return result;
    }

    // Bepaalt welke objecten zich in deze kamer bevinden en interactief zijn
    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const inventory: string[] = playerSession.inventory;
        const result: GameObject[] = [];

        // Voeg de hamer toe aan de kamer als deze nog niet is opgepakt
        if (!playerSession.pickedUpHammer) {
            result.push(new HammerItem());
        }

        // Voeg de stokken toe aan de kamer als deze nog niet zijn opgepakt en nog niet in de inventaris zitten
        if (!inventory.includes("Sticks") && !inventory.includes("10Sticks")) {
            result.push(new SticksItem());
        }

        result.push(new RoofItem());

        return result;
    }

    // Geeft een lijst van mogelijke acties die de speler in deze kamer kan uitvoeren
    public actions(): Action[] {
        const actions: Action[] = [
            new ExamineAction(),
            new PickUpAction(),
            new UseAction(),
        ];
        return actions;
    }

    // Beschrijving van de kamer wanneer de speler deze onderzoekt
    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "The cold air hits your face as you step onto the roof",
            "The city below seems so close, yet still out of reach",
            "Maybe there are things here that can help you escape…",
        ]);
    }
}
