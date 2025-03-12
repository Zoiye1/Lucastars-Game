import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class KeyItem extends Item implements Examine {
    public static readonly Alias: string = "KeyItem";

    public constructor() {
        super(KeyItem.Alias);
    }

    public name(): string {
        return "Key storage";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "A small silver key!",
        ]);
    }
}
