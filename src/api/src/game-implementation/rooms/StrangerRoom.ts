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
import { OpenAction } from "../../game-base/actions/OpenAction";
import { WardrobeItem } from "../items/WardrobeItem";

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
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["strangerroom/StrangerRoomBackground"];

        if (playerSession.wardrobeOpened) {
            result.push("strangerroom/Strangeroom-opend");

            // Sheets alleen toevoegen als ze nog niet zijn opgepakt
            if (!playerSession.pickedUpSheets) {
                result.push("strangerroom/Sheets");
            }
        }

        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Hallway", alias: "hallway", imageRotation: 180, imageCoords: { x: 25, y: 25 } },
            { name: "vent", alias: "Vents", imageRotation: 0, imageCoords: { x: 65, y: 25 } }, /// Recht omhoog

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
            new OpenAction(),
        ];

        return result;
    }

    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [new WardrobeItem()];

        if (!playerSession.pickedUpSheets) {
            result.push(new SheetsItem());
        }

        return result;
    }
}
