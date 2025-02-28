import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { Examine } from "../../game-base/actions/ExamineAction";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class TitleItem extends Item implements Examine {
    public static readonly Alias: string = "TitleScreen";

    public constructor() {
        super(TitleItem.Alias);
    }

    public name(): string {
        return "Title screen";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType {
        return "actionableItem";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "This is the title screen!",
            "It says \"Escaping the mental hospital\".",
            "its a bit hard to read..."]);
    }
}
