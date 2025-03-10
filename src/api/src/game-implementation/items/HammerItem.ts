import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Item } from "../../game-base/gameObjects/Item";
import { gameService } from "../../global";
import { PickUp } from "../actions/PickUpAction";
import { Usable } from "../actions/UseAction";
import { PlayerSession } from "../types";

export class HammerItem extends Item implements Examine, PickUp, Usable {
    public static readonly Alias: string = "HammerItem";

    public constructor() {
        super(HammerItem.Alias);
    }

    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpHammer = true;

        return new TextActionResult(["You have picked up the hammer."]);
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public name(): string {
        return "Hammer";
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a hammer"]);
    }

    /**
     * Probeert de hamer te gebruiken.
     * @returns {ActionResult | undefined} Het resultaat van het proberen te gebruiken van de hamer.
     */
    public use(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const inventory: string[] = playerSession.inventory;
        if (!inventory.includes("10 Sticks")) {
            inventory.push("10 sticks");
            return new TextActionResult([
                "You picked up 10 sticks by hitting the tree.",
            ]);
        }
        else {
            return new TextActionResult([
                "You already picked up 10 sticks from the tree!",
            ]);
        };
    }
}
