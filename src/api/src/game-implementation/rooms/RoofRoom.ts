import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { HammerItem } from "../items/HammerItem";
import { SticksItem } from "../items/SticksItem";
import { PlayerSession } from "../types";
import { VentsRoom } from "./VentsRoom";

export class RoofRoom extends Room implements Simple {
    // Unieke alias voor deze kamer, gebruikt voor identificatie
    public static readonly Alias: string = "roof";

    public constructor() {
        super(RoofRoom.Alias);
    }

    // Geeft de naam van de kamer terug, gebruikt in de UI of logsF
    public name(): string {
        return "Roof";
    }

    // Bepaalt welke afbeeldingen in deze kamer zichtbaar zijn
    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["Roof/RoofBackground"];

        // Voeg de hamer toe aan de afbeeldingen als deze nog niet is opgepakt
        if (!playerSession.pickedUpHammer) {
            result.push("Roof/Hammer");
        }
        // Voeg de stokken toe aan de afbeeldingen als deze nog niet zijn opgepakt
        if (!playerSession.pickedupSticks) {
            result.push("Roof/Sticks");
        }

        return result;
    }

    // Bepaalt welke objecten zich in deze kamer bevinden en interactief zijn
    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [];

        // Voeg de hamer toe aan de kamer als deze nog niet is opgepakt
        if (!playerSession.pickedUpHammer) {
            result.push(new HammerItem());
        }
        // Voeg de stokken toe aan de kamer als deze nog niet zijn opgepakt
        if (!playerSession.pickedupSticks) {
            result.push(new SticksItem());
        }
        return result;
    }

    // Geeft een lijst van mogelijke acties die de speler in deze kamer kan uitvoeren
    public actions(): Action[] {
        return [
            new ExamineAction(),
            new PickUpAction(),
            new SimpleAction("enter-vent", "Return to Vents"),
        ];
    }

    // Beschrijving van de kamer wanneer de speler deze onderzoekt
    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "The cold air hits your face as you step onto the roof",
            "The city below seems so close, yet still out of reach",
            "Maybe there are things here that can help you escape…",
        ]);
    }

    // Verwerkt simpele acties, zoals het betreden van een andere kamer
    public simple(alias: string): ActionResult | undefined {
        let room: Room | undefined;
        switch (alias) {
            case "enter-vent":
                room = new VentsRoom();
                break;
        }
        if (room) {
            // Update de huidige kamer van de speler en geef de beschrijving van de nieuwe kamer terug
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine();
        }
        return undefined;
    }
}
