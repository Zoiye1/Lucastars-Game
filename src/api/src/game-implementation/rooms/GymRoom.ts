import { ActionResult } from "../../game-base/actionResults/ActionResult";
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

    public examine(): ActionResult | undefined {
        throw new Error("Method not implemented.");
    }
}
