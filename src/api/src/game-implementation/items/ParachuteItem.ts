import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Item } from "../../game-base/gameObjects/Item";
import { gameService } from "../../global";
// import { Equippable } from "../actions/EquipAction";
import { PlayerSession } from "../types";

export class ParachuteItem extends Item {
    public static readonly Alias: string = "Parachute";

    public constructor() {
        super(ParachuteItem.Alias);
    }

    public equip(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.equippedParachute = true;

        return new TextActionResult(["You have equipped the parachute."]);
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
