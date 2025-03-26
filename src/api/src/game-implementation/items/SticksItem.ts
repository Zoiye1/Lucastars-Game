import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Item } from "../../game-base/gameObjects/Item";
import { gameService } from "../../global";
import { PickUp } from "../actions/PickUpAction";
import { PlayerSession } from "../types";

export class SticksItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "Sticks";

    public constructor() {
        super(SticksItem.Alias);
    }

    public name(): string {
        return "4 sticks";
    }

    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult {
        return new TextActionResult(["These are 4 sticks"]);
    }

    public pickUp(): ActionResult {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const inventory: string[] = playerSession.inventory;

        if (!inventory.includes("Sticks")) {
            inventory.push("Sticks");
            playerSession.pickedupSticks = true;
        }

        const combineMessage: ActionResult | undefined = this.combineSticks(playerSession);
        if (combineMessage) {
            return combineMessage;
        }

        return new TextActionResult([
            "You have picked up the 4 sticks. You can use them later to make a ladder.",
        ]);
    }

    /**
     * Controleert of de speler zowel 6 sticks als 4 sticks heeft en combineert ze tot 10 sticks.
     * @param {PlayerSession} playerSession - De sessie van de speler.
     * @returns {ActionResult | undefined} Het resultaat van de combinatie (indien succesvol).
     */
    private combineSticks(playerSession: PlayerSession): ActionResult | undefined {
        const inventory: string[] = playerSession.inventory;

        if (inventory.includes("6sticks") && inventory.includes("Sticks")) {
            // Verwijder de losse sticks
            inventory.splice(inventory.indexOf("6sticks"), 1);
            inventory.splice(inventory.indexOf("Sticks"), 1);

            // Voeg 10 sticks toe
            inventory.push("10Sticks");

            return new TextActionResult([
                "You combined the sticks into a bundle of 10 sticks.",
            ]);
        }

        return undefined;
    }
}
