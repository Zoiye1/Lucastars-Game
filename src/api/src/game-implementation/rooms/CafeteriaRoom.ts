import { Arrowroom, ClickItem } from "@shared/types";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { CleanerCharacter } from "../characters/CleanerCharacter";
import { FocusDrinkItem } from "../items/FocusDrinkItem";
import { PlayerSession } from "../types";

/**
 * Class representeert de cafeteria in het spel.
 *
 *  @remarks Bereikbaar via de hallway en gaat door naar courtyard, kitchen of gym
 */
export class CafeteriaRoom extends Room {
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
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["room"];
    }

    /**
     * Geeft de afbeeldingen die worden gebruikt voor de kamer door aan de game engine
     *
     * @returns Een array met afbeeldinglocaties als string
     */

    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["cafeteria/CafeteriaBackground"];

        if (playerSession.helpedCleaner) {
            result.push("cafeteria/CleanerOutOfWay");
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
        if (!playerSession.pickedUpFocusDrink) {
            result.push({ name: "FocusDrink", alias: "FocusDrinkItem", imageUrl: "cafeteria/FocusDrink", type: ["actionableItem"], imageCoords: { x: 30, y: 65 } });
        }
        if (!playerSession.helpedCleaner) {
            result.push({ name: "Cleaner", alias: "cleaner", imageUrl: "cafeteria/CleanerInTheWay", type: ["npc"], imageCoords: { x: 43, y: 45 } });
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
        const result: Action[] = [
            new ExamineAction(),
            new TalkAction(),
            new PickUpAction(),
            // new SimpleAction("enter-kitchen", "Enter Kitchen"),
        ];

        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Hallway", alias: "hallway", imageRotation: 180, imageCoords: { x: 26, y: 85 } },
            { name: "Courtyard", alias: "courtyard", imageRotation: 90, imageCoords: { x: 77, y: 70 } },
            { name: "Gym", alias: "gym", imageRotation: 90, imageCoords: { x: 77, y: 30 } },
        ];

        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (playerSession.helpedCleaner) {
            result.push(
                { name: "Kitchen", alias: "KitchenRoom", imageRotation: 180, imageCoords: { x: 44, y: 24 } }
            );
        }

        return result;
    }
}
