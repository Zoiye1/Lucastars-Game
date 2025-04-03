import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Room } from "../../game-base/gameObjects/Room";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Arrowroom } from "@shared/types";
import { PlayerSession } from "../types";
import { gameService } from "../../global";

export class VentsRoom2 extends Room {
    public static readonly Alias: string = "Vents2";

    public constructor() {
        super(VentsRoom2.Alias);
    }

    public name(): string {
        return "Vents";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["room"];
    }

    public images(): string[] {
        return ["vents/Vents2Background"];
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Vent", alias: "Vents", imageRotation: 90, imageCoords: { x: 77, y: 60 } },
            { name: "stranger room", alias: "strangerroom", imageRotation: 180, imageCoords: { x: 45, y: 70 } },
        ];

        return result;
    }

    public examine(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.enteredVents = true;
        return new TextActionResult(["You are in the Vents... you have 2 options"]);
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),

        ];
    }
}
