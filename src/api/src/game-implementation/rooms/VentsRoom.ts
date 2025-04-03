import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Room } from "../../game-base/gameObjects/Room";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Arrowroom } from "@shared/types";
import { PlayerSession } from "../types";
import { gameService } from "../../global";

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
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: Arrowroom[] = [
            { name: "Vent", alias: "Vents2", imageRotation: -90, imageCoords: { x: 17, y: 60 } },
            { name: "roof", alias: "roof", imageRotation: 90, imageCoords: { x: 77, y: 60 } },
        ];

        if (playerSession.ventUnlocked) {
            result.push(
                { name: "Your Room", alias: "starterroom", imageRotation: 180, imageCoords: { x: 45, y: 75 } }
            );
        }

        return result;
    }

    public examine(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.enteredVents = true;
        return new TextActionResult(["You are now in the Vents, choose where you want to go..."]);
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),

        ];
    }
}
