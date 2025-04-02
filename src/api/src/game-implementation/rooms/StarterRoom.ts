/**
 * Vertegenwoordigt een startkamer waarin de speler begint.
 * De kamer bevat verschillende objecten en uitgangen die ontgrendeld kunnen worden.
 */
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { ForkItem } from "../items/ForkItem";
import { PaintingItem } from "../items/PaintingItem";
import { PickUpAction } from "../actions/PickUpAction";
import { PlayerSession } from "../types";
import { VentItem } from "../items/VentItem";
import { WindowItem } from "../items/WindowItem";
import { UseAction } from "../actions/UseAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Arrowroom, ClickItem } from "@shared/types";
/**
 * Klasse die de startkamer in het spel vertegenwoordigt.
 * De speler kan objecten onderzoeken, oppakken en gebruiken om een uitweg te vinden.
 */
export class StarterRoom extends Room {
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
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["room"];
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
        // if (!playerSession.pickedUpFork) {
        //     result.push("starterroom/StarterRoomFork");
        // }

        // if (!playerSession.pickedUpPainting) {
        //     result.push("starterroom/StarterRoomPainting");
        // }

        return result;
    }

    public ClickItem(): ClickItem[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // Always give 4 paramaters for Click objects: The name (will be displayed), alias,
        // The imageurl and the types

        // result as an array of ClickItem objects
        const result: ClickItem[] = [

        ];
        if (!playerSession.pickedUpFork) {
            result.push({ name: "Fork", alias: "ForkItem", imageUrl: "starterroom/StarterRoomFork", type: ["actionableItem"], imageCoords: { x: 50, y: 69 } });
        }

        if (!playerSession.pickedUpPainting) {
            result.push({ name: "Pain ting", alias: "PaintingItem", imageUrl: "starterroom/StarterRoomPainting", type: ["actionableItem"], imageCoords: { x: 25, y: 42 } });
        }

        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
        ];
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (playerSession.ventUnlocked) {
            result.push(
                { name: "vent", alias: "Vents", imageRotation: 0, imageCoords: { x: 26, y: 16 } }
            );
        }
        if (playerSession.windowBroken) {
            result.push(
                { name: "Hallway", alias: "hallway", imageRotation: 180, imageCoords: { x: 50, y: 25 } }
            );
        }

        return result;
    }

    /**
     * Onderzoekt de kamer en geeft een beschrijving.
     * @returns {ActionResult | undefined} De beschrijving van de startkamer.
     */
    public examine(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (!playerSession.HasVisitedStarterRoom) {
            playerSession.HasVisitedStarterRoom = true;
            return new TextActionResult([
                "You wake up with a pounding headache",
                "You have no idea where you are. Your head throbs as you glance around the room.",
                "The door is locked. You need to find a way out!",
            ]);
        }
        else {
            return new TextActionResult([
                "You're back in the room where you woke up.",
                "The familiar surroundings bring back the memory of your confusion when you first arrived.",
                "You need to keep looking for a way out.",
            ]);
        }
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
        const result: Action[] = [
            new ExamineAction(),
        ];

        if (!playerSession.pickedUpPainting || !playerSession.pickedUpFork) result.push(new PickUpAction());

        if (!playerSession.windowBroken || !playerSession.ventUnlocked) result.push(new UseAction());

        return result;
    }
}
