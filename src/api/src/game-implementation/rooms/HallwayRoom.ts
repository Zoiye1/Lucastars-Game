import { Arrowroom } from "@shared/types";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";

export class HallwayRoom extends Room {
    public static readonly Alias: string = "hallway";

    public constructor() {
        super(HallwayRoom.Alias);
    }

    public name(): string {
        return "Hallway";
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
        return ["hallway/HallwayBackground"];
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Your-room", alias: "starterroom", imageRotation: 90, imageCoords: { x: 77, y: 30 } },
            { name: "Stranger-room", alias: "strangerroom", imageRotation: -90, imageCoords: { x: 54, y: 10 } },
            { name: "Cafeteria", alias: "cafeteria", imageRotation: 180, imageCoords: { x: 50, y: 80 } },
            { name: "Toilet", alias: "toilet", imageRotation: 90, imageCoords: { x: 68, y: 10 } },
        ];

        return result;
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["The hallway goes in many directions. Which way will you go?"]);
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
        ];
    }
}
