import { Item } from "../../game-base/gameObjects/Item";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class ParachuteItem extends Item {
    public static readonly Alias: string = "ParachuteItem";

    public constructor() {
        super(ParachuteItem.Alias);
    }

    public name(): string {
        return "Parachute";
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
