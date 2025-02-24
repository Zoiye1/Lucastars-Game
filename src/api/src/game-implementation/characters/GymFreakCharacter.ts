import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Character } from "../../game-base/gameObjects/Character";

export class GymFreakCharacter extends Character {
    public static readonly Alias: string = "GymFreak";

    public constructor() {
        super(GymFreakCharacter.Alias);
    }

    public name(): string {
        return "GymFreak";
    }

    public talk(choiceId?: number): ActionResult | undefined {
        return undefined;
    }
}
