/**
 * Vertegenwoordigt een startkamer waarin de speler begint.
 * De kamer bevat verschillende objecten en uitgangen die ontgrendeld kunnen worden.
 */
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { ForkItem } from "../items/ForkItem";
import { PaintingItem } from "../items/PaintingItem";
import { HallwayRoom } from "./HallwayRoom";
import { PickUpAction } from "../actions/PickUpAction";
import { PlayerSession } from "../types";
import { VentsRoom } from "./VentsRoom";
import { VentItem } from "../items/VentItem";
import { WindowItem } from "../items/WindowItem";
import { UseAction } from "../actions/UseAction";

/**
 * Klasse die de startkamer in het spel vertegenwoordigt.
 * De speler kan objecten onderzoeken, oppakken en gebruiken om een uitweg te vinden.
 */
export class StarterRoom extends Room implements Simple {
    /** De alias voor de startkamer. */
    public static readonly Alias: string = "starterroom";

    /**
     * Maakt een nieuwe instantie van StarterRoom aan.
     */
    public constructor() {
        super(StarterRoom.Alias);
    }

    /**
     * Haalt de naam van de kamer op.
     * @returns {string} De naam van de startkamer.
     */
    public name(): string {
        return "Starterroom";
    }

    /**
     * Haalt de beschikbare achtergrondafbeeldingen op, afhankelijk van de voortgang van de speler.
     * @returns {string[]} Een lijst met padnamen van achtergrondafbeeldingen.
     */
    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = [];

        // Kies de juiste achtergrond afhankelijk van de ontgrendelde uitgangen
        if (playerSession.windowBroken && playerSession.ventUnlocked) {
            result.push("starterroom/StarterRoomBackground4");
        }
        else if (playerSession.windowBroken) {
            result.push("starterroom/StarterRoomBackground2");
        }
        else if (playerSession.ventUnlocked) {
            result.push("starterroom/StarterRoomBackground3");
        }
        else {
            result.push("starterroom/StarterRoomBackground");
        }

        // Voeg objecten toe die nog niet zijn opgepakt
        if (!playerSession.pickedUpFork) {
            result.push("starterroom/StarterRoomFork");
        }

        if (!playerSession.pickedUpPainting) {
            result.push("starterroom/StarterRoomPainting");
        }

        return result;
    }

    /**
     * Onderzoekt de kamer en geeft een beschrijving.
     * @returns {ActionResult | undefined} De beschrijving van de startkamer.
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "You wake up with a pounding headache",
            "You have no idea where you are. Your head throbs as you glance around the room.",
            "The door is locked. You need to find a way out!",
        ]);
    }

    /**
     * Haalt de objecten in de kamer op die de speler kan onderzoeken of gebruiken.
     * @returns {GameObject[]} Een lijst van interactieve objecten in de kamer.
     */
    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [];

        if (!playerSession.pickedUpFork) {
            result.push(new ForkItem());
        }

        if (!playerSession.pickedUpPainting) {
            result.push(new PaintingItem());
        }

        // Voeg altijd de ventilatie en het raam toe als interactieve objecten
        result.push(new VentItem());
        result.push(new WindowItem());

        return result;
    }

    /**
     * Haalt de beschikbare acties op die de speler kan uitvoeren in de startkamer.
     * @returns {Action[]} Een lijst met beschikbare acties.
     */
    public actions(): Action[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const actions: Action[] = [
            new ExamineAction(),
            new PickUpAction(),
            new UseAction(),
        ];

        // Voeg opties toe om de gang of ventilatie te betreden als deze ontgrendeld zijn
        if (playerSession.ventUnlocked) {
            actions.push(new SimpleAction("enter-vent", "Enter Vent"));
        }

        if (playerSession.windowBroken) {
            actions.push(new SimpleAction("enter-hallway", "Enter Hallway"));
        }

        return actions;
    }

    /**
     * Behandelt eenvoudige acties die de speler kan uitvoeren, zoals het betreden van een nieuwe kamer.
     * @param {string} alias - De alias van de actie.
     * @returns {ActionResult | undefined} Het resultaat van de actie.
     */
    public simple(alias: string): ActionResult | undefined {
        switch (alias) {
            case "enter-hallway": {
                const room: HallwayRoom = new HallwayRoom();
                gameService.getPlayerSession().currentRoom = room.alias;
                return room.examine();
            }
            case "enter-vent": {
                const room: VentsRoom = new VentsRoom();
                gameService.getPlayerSession().currentRoom = room.alias;
                return room.examine();
            }
        }

        return undefined;
    }
}
