import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Action } from "../../game-base/actions/Action";

/**
 * Interface voor objects die gebruikt kunnen worden.
 */
@Interface
export abstract class Place {
    /**
     * Voert de Place uit op het object.
     * @returns {ActionResult | undefined} Het resultaat van de action of undefined als er geen resultaat is.
     */
    public abstract place(): ActionResult | undefined;
}

/**
 * Class die de Place action vertegenwoordigt.
 */
export class PlaceAction extends Action {
    /**
     * Alias die wordt gebruikt om deze action te identificeren.
     */
    public static readonly Alias: string = "place";

    /**
     * Maakt een nieuwe instantie van de Place action.
     */
    public constructor() {
        super(PlaceAction.Alias, true);
    }

    /**
     * Geeft de naam van de action terug.
     * @returns {string} De naam van de action.
     */
    public name(): string {
        return "Place";
    }

    /**
     * Voert de Place action uit op een game-object.
     * @param {string} _alias - De alias van de action.
     * @param {GameObject[]} gameObjects - De lijst van game-objecten waarop de action wordt uitgevoerd.
     * @returns {ActionResult | undefined} Het resultaat van de action of een tekstresultaat als het object niet bruikbaar is.
     */
    public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
        const gameObject: GameObject = gameObjects[0];

        if (gameObject.instanceOf(Place)) {
            return gameObject.place();
        }

        return new TextActionResult(["That doesnt make any sense."]);
    }
}
