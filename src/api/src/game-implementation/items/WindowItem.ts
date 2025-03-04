/**
 * Represents a vent item that can be examined and used.
 * The vent is initially screwed shut and requires a tool to open.
 */
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { Usable } from "../actions/UseAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

/**
 * Class representing a vent item in the game.
 * The player can examine it or attempt to use it.
 */
export class VentItem extends Item implements Examine, Usable {
    /** The alias for the vent item. */
    public static readonly Alias: string = "VentItem";

    /**
     * Constructs a new VentItem instance.
     */
    public constructor() {
        super(VentItem.Alias);
    }

    /**
     * Gets the display name of the item.
     * @returns {string} The name of the vent item.
     */
    public name(): string {
        return "Vent";
    }

    /**

    Geeft de type van de GameObject terug*
    @returns De type van de GameObject (GameObjectType union) */
    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    /**
     * Examines the vent item, providing a description.
     * @returns {ActionResult | undefined} The result of examining the vent.
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["A metal vent cover. It's screwed shut."]);
    }

    /**
     * Attempts to use the vent item.
     * If the player has a fork, they can unscrew the vent cover.
     * @returns {ActionResult | undefined} The result of attempting to use the vent.
     */
    public use(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const hasFork: boolean = playerSession.pickedUpFork;

        if (hasFork) {
            playerSession.ventUnlocked = true;
            return new TextActionResult([
                "You use the fork to unscrew the vent cover. You can now enter the vent.",
            ]);
        }

        return new TextActionResult([
            "You need something to unscrew the vent cover.",
        ]);
    }
}
