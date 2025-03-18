import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Action } from "../../game-base/actions/Action";

/**
 * Class die de Jump action vertegenwoordigt.
 */

@Interface
export abstract class Jump {
    /**
     * Voert de Jump action uit
     *
     * @returns Het resultaat van de Pick Up action of `undefined` als de actie niet is afgehandeld
     */
    public abstract jump(): ActionResult | undefined;
}

export class JumpAction extends Action {
    /**
     * Alias die wordt gebruikt om deze action te identificeren.
     */
    public static readonly Alias: string = "jump";

    /**
     * Maakt een nieuwe instantie van de Jump action.
     */
    public constructor() {
        super(JumpAction.Alias, false);
    }

    /**
     * Geeft de naam van de action terug.
     * @returns {string} De naam van de action.
     */
    public name(): string {
        return "Jump";
    }

    public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        return JumpAction.execute(_alias, gameObjects[0]);
    }

    /**
     * Voert de Jump action uit.
     * @param {string} _alias - De alias van de action.
     * @param {GameObject[]} gameObjects - De lijst van game-objecten waarop de action wordt uitgevoerd.
     * @returns {ActionResult | undefined} Het resultaat van de action of undefined.
     */
    public static execute(_alias: string, gameObject: GameObject): ActionResult | undefined {
        if (gameObject.instanceOf(Jump)) {
            return gameObject.jump();
        }
        return undefined;
    }
}
