import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Room } from "../../game-base/gameObjects/Room";

export class Toilet extends Room {
    public static readonly Alias: string = "toilet";

    public constructor() {
        super(Toilet.Alias);
    }

    public name(): string {
        return "Toilet";
    }

    public images(): string[] {
        return ["toilet"];
    }

    public examine(): ActionResult | undefined {
        return undefined;
    }
}
