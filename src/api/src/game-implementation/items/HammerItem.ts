import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Item } from "../../game-base/gameObjects/Item";
import { gameService } from "../../global";
import { PickUp } from "../actions/PickUpAction";
import { PlayerSession } from "../types";

// Klasse voor het HammerItem, dat opgepakt en onderzocht kan worden
export class HammerItem extends Item implements Examine, PickUp {
    public static readonly Alias: string = "HammerItem";

    public constructor() {
        super(HammerItem.Alias);
    }

    /**
     * Functie om de hamer op te pakken.
     * Voegt de hamer toe aan de inventaris van de speler en geeft een bericht terug.
     */
    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpHammer = true; // Markeer dat de speler de hamer heeft opgepakt

        return new TextActionResult([
            "You have picked up the hammer. You can use it later to make a ladder.",
        ]);
    }

    /**
     * Geeft het type van het object terug.
     * In dit geval is het een "actionableItem", wat betekent dat het een interactief item is.
     */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    /**
     * Retourneert de naam van het item.
     */
    public name(): string {
        return "Hammer";
    }

    /**
     * Functie om het item te onderzoeken.
     * Geeft een korte beschrijving van de hamer terug.
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is a hammer"]);
    }
}
