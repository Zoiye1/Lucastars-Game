import { Arrowroom } from "@shared/types";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { PlaceAction } from "../actions/PlaceAction";
import { UseAction } from "../actions/UseAction";
import { SmokerCharacter } from "../characters/SmokerCharacter";
import { JumpRopeItem } from "../items/JumpRopeItem";
import { TreeItem } from "../items/TreeItem";
import { PlayerSession } from "../types";
import { LadderItem } from "../items/LadderItem";

/**
 * Class representeert de courtyard in het spel.
 *
 *  @remarks Bereikbaar via de cafeteria
 */
export class CourtyardRoom extends Room {
    /** Alias van deze kamer */
    public static readonly Alias: string = "courtyard";

    public constructor() {
        super(CourtyardRoom.Alias);
    }

    /**
     * Geeft de naam van de kamer terug
     *
     * @returns De string "Courtyard"
     */
    public name(): string {
        return "Courtyard";
    }

    /**
     * Geeft de types van de GameObject terug
     *
     * @returns De types van de GameObject (GameObjectType union)
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
        const inventory: string[] = playerSession.inventory;
        const result: string[] = ["courtyard/courtyardBackground", "courtyard/Smoker"];

        if (inventory.includes("10 Sticks")) {
            result.push("courtyard/courtyardTreeBroken");
        };
        if (!playerSession.pickedUpJumpRope) {
            result.push("courtyard/JumpRope");
        }
        if (playerSession.placedEscapeLadder) {
            result.push("courtyard/EscapeLadder");
        }

        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Cafeteria", alias: "cafeteria", imageRotation: 90, imageCoords: { x: 75, y: 80 } },
        ];

        if (playerSession.placedEscapeLadder) {
            result.push({ name: "The End", alias: "courtyard-end", imageRotation: 90, imageCoords: { x: 20, y: 100 } });
        };

        return result;
    }

    /**
     * Voert de examine-actie uit voor de kamer
     *
     * @returns Een text action dat de speler verwelkomt in de courtyard
     */
    public examine(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        if (!playerSession.inventory.includes("LadderItem")) {
            return new TextActionResult(["Welcome to the courtyard."]);
        }
        else {
            return new TextActionResult(["Maybe we can climb out of here...!"]);
        }
    }

    /**
     * Geeft de objecten terug die zich in deze kamer bevinden
     *
     * @returns Een array van game objecten, zoals de smoker en de jump rope, als die aanwezig zijn
     */
    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [new SmokerCharacter(), new TreeItem()];

        if (!playerSession.pickedUpJumpRope) {
            result.push(new JumpRopeItem());
        }

        if (playerSession.inventory.includes("LadderItem")) result.push(new LadderItem());

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
        ];

        if (playerSession.inventory.includes("HammerItem")) result.push(new UseAction());
        if (playerSession.inventory.includes("LadderItem")) result.push(new PlaceAction());

        return result;
    }
}
