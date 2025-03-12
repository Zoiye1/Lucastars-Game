import { Arrowroom } from "@shared/types";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { SheetsItem } from "../items/SheetsItem";
import { PlayerSession } from "../types";

export class StrangerRoom extends Room {
    public static readonly Alias: string = "strangerroom";

    public constructor() {
        super(StrangerRoom.Alias);
    }

    public name(): string {
        return "StrangerRoom";
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
        return ["strangerroom/StrangerRoomBackground"];
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Hallway", alias: "hallway", imageRotation: 180, imageCoords: { x: 25, y: 25 } },
        ];

        return result;
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You walk into a room with an open door, it looks like its a room from someone else...",
            "You might be able to find something useful here"]);
    }

    public actions(): Action[] {
        const result: Action[] = [
            new ExamineAction(),
            new PickUpAction(),
        ];

        return result;
    }

    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [];

        if (!playerSession.pickedUpSheets) {
            result.push(new SheetsItem());
        }
        return result;
    }
}
