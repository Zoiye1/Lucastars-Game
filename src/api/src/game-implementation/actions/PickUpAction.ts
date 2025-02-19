import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Action } from "../../game-base/actions/Action";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { gameService } from "../../global";
import { PlayerSession } from "../types";

/**
 * Interface voor game objects die de Pick Up action moeten ondersteunen
 */
@Interface
export abstract class PickUp {
    /**
     * Voert de Pick Up action uit
     *
     * @returns Het resultaat van de Pick Up action of `undefined` als de actie niet is afgehandeld
     */
    public abstract pickUp(): ActionResult | undefined;
}

/**
 * Class die de Pick Up action representeert
 */
export class PickUpAction extends Action {
    /** Alias die wordt gebruikt om de Pick Up-actie te identificeren */
    public static readonly Alias: string = "pick-up";

    public constructor() {
        super(PickUpAction.Alias, true);
    }

    /**
     * @inheritdoc
     */
    public name(): string {
        return "Pick up";
    }

    /**
     * Voert de Pick Up action uit
     *
     * @param _alias Optionele alias variabele die de pick up action alias bevat
     * @param gameObjects Een array van game-objecten, waarbij de eerste index verwijst naar het game-object waarop de Pick Up action moet worden uitgevoerd.
     *
     * @returns Het resultaat van de Pick Up action of `undefined` als de actie niet is afgehandeld
     */

    public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        const gameObject: GameObject = gameObjects[0];
        const playerSession: PlayerSession = gameService.getPlayerSession();

        // Als de gekozen gameobject een oppakbare item is
        if (gameObject.instanceOf(PickUp)) {
            playerSession.inventory.push(gameObject.alias);

            return gameObject.pickUp();
        }

        return undefined;
    }
}
