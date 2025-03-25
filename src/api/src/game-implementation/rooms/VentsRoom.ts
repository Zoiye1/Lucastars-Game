import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Room } from "../../game-base/gameObjects/Room";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Arrowroom } from "@shared/types";

export class VentsRoom extends Room {
    public static readonly Alias: string = "Vents";

    public constructor() {
        super(VentsRoom.Alias);
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
        return ["vents/VentsBackground"];
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Go-left", alias: "strangerroom", imageRotation: -90, imageCoords: { x: 17, y: 60 } },
            { name: "Go-right", alias: "roof", imageRotation: 90, imageCoords: { x: 77, y: 60 } },
            { name: "Go-back", alias: "starterroom", imageRotation: 180, imageCoords: { x: 45, y: 80 } },
        ];

        return result;
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You are now in the Vents, you have to make a choice... Left or Right?"]);
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),

        ];
    }
}
