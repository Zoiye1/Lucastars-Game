import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { BucketItem } from "../items/BucketItem";
import { Action } from "../../game-base/actions/Action";
import { PickUpAction } from "../actions/PickUpAction";
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
        return ["toilet", "toilet/Bucket"];
    }

    public objects(): GameObject [] {
        return [
            new BucketItem(),
        ];
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new PickUpAction(),

        ];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["It's a toilet."]);
    }
}
