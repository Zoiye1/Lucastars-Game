import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { PlayerSession } from "../types";
import { GlassBeakerItem } from "../items/GlassBeakerItem";
import { SulfuricAcidItem } from "../items/SulfuricAcidItem";
import { StorageRoom } from "./StorageRoom";

export class LabRoom extends Room implements Simple {
    public static readonly Alias: string = "labroom";

    public constructor() {
        super(LabRoom.Alias);
    }

    public name(): string {
        return "The Lab";
    }

    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["lab/labBackground"];

        if (!playerSession.pickedUpFork) {
            result.push("lab/labSulfuricAcid");
        }

        if (!playerSession.pickedUpPainting) {
            result.push("lab/labGlassBeaker");
        }

        return result;
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You walk into a mysterious lab...",
        ]);
    }

    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [];

        if (!playerSession.pickedUpGlassBeaker) {
            result.push(new GlassBeakerItem());
        }

        if (!playerSession.pickedUpSulfuricAcid) {
            result.push(new SulfuricAcidItem());
        }
        return result;
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new SimpleAction("enter-storage", "Enter Storage"),
            new PickUpAction(),
        ];
    }

    public simple(alias: string): ActionResult | undefined {
        if (alias === "enter-storage") {
            const room: Room = new StorageRoom();

            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }
        return undefined;
    }
}
