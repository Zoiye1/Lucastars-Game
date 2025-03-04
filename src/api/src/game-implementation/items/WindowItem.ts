import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";

/**
 * Class die het WindowItem representeert
 */
export class WindowItem extends GameObject implements Examine {
    public static readonly Alias: string = "WindowItem";

    public constructor() {
        super(WindowItem.Alias);
    }

    /**
     * @inheritdoc
     */
    public name(): string {
        return "Window";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    /**
     * Voert de Examine action uit
     *
     * @returns Een beschrijving van het object
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["A fragile-looking window."]);
    }
}
