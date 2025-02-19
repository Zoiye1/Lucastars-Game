import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PickUp } from "../actions/PickUpAction";
import { gameService } from "../../global";
import { PlayerSession } from "../types";

export class BucketItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "bucket";

    public constructor() {
        super(BucketItem.Alias);
    }

    public name(): string {
        return "Bucket";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["It's a bucket."]);
    }

    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpBucket = true;

        return new TextActionResult(["You have picked up the bucket."]);
    }
}
