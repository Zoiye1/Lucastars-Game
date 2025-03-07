import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Action } from "../../game-base/actions/Action";

/**
 * Interface voor objects die gebruikt kunnen worden.
 */
@Interface
export abstract class Usable {
    /**
     * Voert de gebruiksactie uit op het object.
     * @returns {ActionResult | undefined} Het resultaat van de actie, of undefined als er geen resultaat is.
     */
    public abstract use(): ActionResult | undefined;
}

/**
 * Klasse die de "Use"-actie vertegenwoordigt.
 */
export class UseAction extends Action {
    /**
     * Alias die wordt gebruikt om deze actie te identificeren.
     */
    public static readonly Alias: string = "use";

    /**
     * Maakt een nieuwe instantie van de UseAction.
     */
    public constructor() {
        super(UseAction.Alias, true);
    }

    /**
     * Geeft de naam van de actie terug.
     * @returns {string} De naam van de actie.
     */
    public name(): string {
        return "Use";
    }

    /**
     * Voert de "Use"-actie uit op een game-object.
     * @param {string} _alias - De alias van de actie (wordt niet gebruikt in deze implementatie).
     * @param {GameObject[]} gameObjects - De lijst van game-objecten waarop de actie wordt uitgevoerd.
     * @returns {ActionResult | undefined} Het resultaat van de actie, of een tekstresultaat als het object niet bruikbaar is.
     */
    public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        const gameObject: GameObject = gameObjects[0];

        if (gameObject.instanceOf(Usable)) {
            return gameObject.use();
        }

        return new TextActionResult(["That doesnt make any sense."]);
    }
}
