import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { BucketItem } from "../items/BucketItem";
import { Action } from "../../game-base/actions/Action";
import { PickUpAction } from "../actions/PickUpAction";
import { gameService } from "../../global";
import { PlayerSession } from "../types";
import { SimpleAction } from "../../game-base/actions/SimpleAction";
import { CourtyardRoom } from "./CourtyardRoom";
// import { UseAction } from "../../game-implementation/actions/UseAction";

export class Toilet extends Room {
    public static readonly Alias: string = "toilet";

    public constructor() {
        super(Toilet.Alias);
    }

    public name(): string {
        return "Toilet";
    }

    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["toilet/ToiletBackground", "toilet/ArrowToHallway"];
        if (!playerSession.pickedUpBucket) {
            result.push("toilet/Bucket");
        }
        return result;
    }

    public objects(): GameObject [] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [];
        if (!playerSession.pickedUpBucket) {
            result.push(new BucketItem());
        }
        return result;
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new PickUpAction(),
            new SimpleAction("enter-hallway", "Enter the Hallway"),

        ];
    }

    public simpel(alias: string): ActionResult | undefined {
        if (alias === "enter-hallway") {
            const room: Room = new CourtyardRoom();

            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }

        return undefined;
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["It's a toilet."]);
    }
}
