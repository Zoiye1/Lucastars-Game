import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class KeypadStorageItem extends Item implements Examine {
    public static readonly Alias: string = "KeypadItem";

    public constructor() {
        super(KeypadStorageItem.Alias);
    }

    public name(): string {
        return "Keypad";
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
            "This seems to be used to open the elevator",
            "It seems to require somekind of key card to use",
        ]);
    }
}
