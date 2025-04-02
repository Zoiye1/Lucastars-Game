import { Arrowroom, ClickItem } from "@shared/types";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple } from "../../game-base/actions/SimpleAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { GymFreakCharacter } from "../characters/GymFreakCharacter";
import { PlayerSession } from "../types";
import { CafeteriaRoom } from "./CafeteriaRoom";
import { GymTheEndRoom } from "./GymEndRoom";

// Klasse die de Gym Room definieert in de game
export class GymRoom extends Room implements Simple {
    public static readonly Alias: string = "gym"; // Unieke identifier voor de kamer

    public constructor() {
        super(GymRoom.Alias);
    }

    // Geeft de naam van de kamer terug
    public name(): string {
        return "Gym";
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
        const result: string[] = ["Gym/GymBackground"]; // Achtergrondafbeelding

        // Verander het personagebeeld op basis van of de speler heeft geholpen
        if (playerSession.helpedGymFreak) {
            result.push("gif/GymFreakEnd");
        }

        return result;
    }

    public ClickItem(): ClickItem[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // Always give 4 paramaters for Click objects: The name (will be displayed), alias,
        // The imageurl and the types

        // result as an array of ClickItem objects
        const result: ClickItem[] = [
        ];
        if (!playerSession.helpedGymFreak) {
            result.push({ name: "GymFreak", alias: "GymFreak", imageUrl: "gif/GymFreakCharacter", type: ["npc"], imageCoords: { x: 20, y: 52 } });
        }

        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Cafeteria", alias: "cafeteria", imageRotation: 90, imageCoords: { x: 87, y: 60 } },
        ];
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // Only add the arrow is the player actually opened the door
        if (playerSession.helpedGymFreak) {
            result.push(
                { name: "Escape", alias: "GymEnd", imageRotation: -90, imageCoords: { x: 5, y: 60 } }
            );
        }

        return result;
    }

    // Geeft een lijst van objecten in de kamer terug
    public objects(): GameObject[] {
        return [
            new GymFreakCharacter(), // Gym Freak personage aanwezig in de kamer
        ];
    }

    // Geeft een lijst van mogelijke acties in de kamer
    public actions(): Action[] {
        const result: Action[] = [
            new ExamineAction(), // Speler kan de kamer onderzoeken
            new TalkAction(), // Speler kan praten met de Gym Freak
        ];

        return result;
    }

    // Beschrijving van de kamer wanneer de speler deze onderzoekt
    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "You step into the gym, the air thick with the smell of sweat and metal",
            "Weights are scattered everywhere, some still rolling on the floor.",
            "In the corner, a gym freak stares straight at you",
        ]);
    }

    // Verwerkt simpele acties zoals het betreden van een andere kamer
    public simple(alias: string): ActionResult | undefined {
        let room: Room | undefined;
        switch (alias) {
            case "caf-door":
                room = new CafeteriaRoom(); // Speler verplaatst naar de Cafeteria Room
                break;
            case "enter-end":
                room = new GymTheEndRoom();
        }

        if (room) {
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine(); // Geef de beschrijving van de nieuwe kamer terug
        }
        return undefined;
    }
}
