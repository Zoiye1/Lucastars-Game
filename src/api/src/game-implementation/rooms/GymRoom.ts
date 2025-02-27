import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { GymFreakCharacter } from "../characters/GymFreakCharacter";
import { PlayerSession } from "../types";
import { CafeteriaRoom } from "./CafeteriaRoom";

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

    // Bepaalt welke afbeeldingen in deze kamer zichtbaar zijn
    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["Gym/GymBackground"]; // Achtergrondafbeelding

        // Verander het personagebeeld op basis van of de speler heeft geholpen
        if (!playerSession.helpedGymFreak) {
            result.push("Gym/GymFreakStart");
        }
        else {
            result.push("Gym/GymFreakEnd");
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
        return [
            new ExamineAction(), // Speler kan de kamer onderzoeken
            new TalkAction(), // Speler kan praten met de Gym Freak
            new SimpleAction("caf-door", "Go to cafeteria"), // Verplaatsing naar de Cafeteria Room
        ];
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
        }
        if (room) {
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine(); // Geef de beschrijving van de nieuwe kamer terug
        }
        return undefined;
    }
}
