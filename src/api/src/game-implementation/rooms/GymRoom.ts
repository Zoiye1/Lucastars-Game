import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";

export class GymRoom extends Room {
    public static readonly Alias: string = "gym";

    public constructor() {
        super(GymRoom.Alias);
    }

    public name(): string {
        return "Gym";
    }

    public images(): string[] {
        return ["Gym/GymBackground", "Gym/GymFreakStart"];
    }

    public objects(): SyncOrAsync<GameObject[]> {
        return [];
    }

    public actions(): SyncOrAsync<Action[]> {
        return [
            new ExamineAction(),
        ];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "You step into the gym, the air thick with the smell of sweat and metal",
            "Weights are scattered everywhere, some still rolling on the floor.",
            "In the corner, a gym freak stares straight at you",
        ]);
    }
}
