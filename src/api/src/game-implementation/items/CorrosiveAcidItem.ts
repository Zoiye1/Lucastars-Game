import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Item } from "../../game-base/gameObjects/Item";

/**
 * Class die het item "Ladder" representeert
 *
 * Dit item kan worden geplaatst (Place).
 */
export class CorrosiveAcidItem extends Item {
    /** Alias die wordt gebruikt om dit item te identificeren */
    public static readonly Alias: string = "CorrosiveAcid";

    public constructor() {
        super(CorrosiveAcidItem.Alias);
    }

    /**
     * Geeft de naam van het item terug
     *
     * @returns De naam van het item
     */
    public name(): string {
        return "Corrosive Acid";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }
}
