import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { Item } from "../../game-base/gameObjects/Item";
import { PickUp } from "../actions/PickUpAction";
import { gameService } from "../../global";
import { PlayerSession } from "../types";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

/**
 * Klasse die een emmer (bucket) representeert als een item in het spel.
 * Dit item kan worden onderzocht en opgepakt door de speler.
 */
export class BucketItem extends Item implements Examine, PickUp {
    /** Alias voor het item bucket. */
    public static readonly Alias: string = "bucket";

    /**
     * Constructor voor de BucketItem-klasse.
     */
    public constructor() {
        super(BucketItem.Alias);
    }

    /**
     * Retourneert de naam van het item.
     */
    public name(): string {
        return "Bucket";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType {
        return "actionableItem";
    }

    /**
     * Geeft een beschrijving van het item wanneer de speler het onderzoekt.
     * @returns Een actie resultaat met de beschrijving van de emmer.
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["It's a bucket."]);
    }

    /**
     * Laat de speler het item oppakken en update de spelstatus.
     * @returns Een actie resultaat waarin wordt bevestigd dat de emmer is opgepakt.
     */
    public pickUp(): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        playerSession.pickedUpBucket = true;

        return new TextActionResult(["You have picked up the bucket."]);
    }
}
