import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { CleanerCharacter } from "../characters/CleanerCharacter";
import { FocusDrinkItem } from "../items/FocusDrinkItem";
import { PlayerSession } from "../types";
import { CourtyardRoom } from "./CourtyardRoom";
import { KitchenRoom } from "./KitchenRoom";
import { StartupRoom } from "./StartupRoom";

/**
 * Class representeert de cafeteria in het spel.
 *
 *  @remarks Bereikbaar via de hallway en gaat door naar courtyard, kitchen of gym
 */
export class CafeteriaRoom extends Room implements Simple {
    /** Alias van deze kamer */
    public static readonly Alias: string = "cafeteria";

    public constructor() {
        super(CafeteriaRoom.Alias);
    }

    /**
     * Geeft de naam van de kamer terug
     *
     * @returns De string "Cafeteria"
     */
    public name(): string {
        return "Cafeteria";
    }

    /**
     * Geeft de afbeeldingen die worden gebruikt voor de kamer door aan de game engine
     *
     * @returns Een array met afbeeldinglocaties als string
     */

    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["cafeteria/CafeteriaBackground"];

        if (!playerSession.helpedCleaner) {
            result.push("cafeteria/CleanerInTheWay");
        }
        else {
            result.push("cafeteria/CleanerOutOfWay");
        }
        if (!playerSession.pickedUpFocusDrink) {
            result.push("cafeteria/FocusDrink");
        }

        return result;
    }

    /**
     * Voert de examine-actie uit voor de kamer
     *
     * @returns Een text action dat de speler verwelkomt in de cafetaria
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["Welcome to the cafeteria."]);
    }

    /**
     * Geeft de objecten terug die zich in deze kamer bevinden
     *
     * @returns Een array van game objecten, zoals de cleaner en de focus drink, als die aanwezig zijn
     */
    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [new CleanerCharacter()];

        if (!playerSession.pickedUpFocusDrink) {
            result.push(new FocusDrinkItem());
        }
        return result;
    }

    /**
     * Geeft een array van actions die beschikbaar zijn in deze kamer
     *
     * @returns Een array van mogelijke actions
     */
    public actions(): Action[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        const result: Action[] = [
            new ExamineAction(),
            new TalkAction(),
            new PickUpAction(),
            new SimpleAction("enter-hallway", "Enter Hallway"),
            new SimpleAction("enter-courtyard", "Enter Courtyard"),
            new SimpleAction("enter-gym", "Enter Gym"),
            new SimpleAction("enter-kitchen", "Enter Kitchen"),
        ];

        if (playerSession.helpedCleaner) result.push(new SimpleAction("enter-kitchen", "Enter Kitchen"));

        return result;
    }

    /**
     * Voert een simpele actie uit op basis van een alias
     *
     * @param alias Het alias van de action die moet worden uitgevoerd
     * @returns Het resultaat van de action of `undefined` als de action niet bestaat
     */
    public simple(alias: string): ActionResult | undefined {
        let room: Room | undefined;

        switch (alias) {
            case "enter-hallway":
                room = new StartupRoom();
                break;
            case "enter-courtyard":
                room = new CourtyardRoom();
                break;
            case "enter-gym":
                room = new StartupRoom();
                break;
            case "enter-kitchen":
                room = new KitchenRoom();
                break;
        }

        if (room) {
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine();
        }

        if (alias === "enter-kitchen") {
            const room: Room = new KitchenRoom();

            // Set the current room to the startup room
            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }
        return undefined;
    }
}
