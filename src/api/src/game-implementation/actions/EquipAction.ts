// import { ActionResult } from "../../game-base/actionResults/ActionResult";
// import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
// import { GameObject } from "../../game-base/gameObjects/GameObject";
// import { Action } from "../../game-base/actions/Action";

// /**
//  * Interface voor objects die uitgerust kunnen worden.
//  */
// @Interface
// export abstract class Equippable {
//     /**
//      * Voert de Equip actie uit op het object.
//      * @returns {ActionResult | undefined} Het resultaat van de actie of undefined als er geen resultaat is.
//      */
//     public abstract equip(): ActionResult | undefined;
// }

// /**
//  * Class die de Equip action vertegenwoordigt.
//  */
// export class EquipAction extends Action {
//     /**
//      * Alias die wordt gebruikt om deze action te identificeren.
//      */
//     public static readonly Alias: string = "equip";

//     /**
//      * Maakt een nieuwe instantie van de Equip action.
//      */
//     public constructor() {
//         super(EquipAction.Alias, true);
//     }

//     /**
//      * Geeft de naam van de action terug.
//      * @returns {string} De naam van de action.
//      */
//     public name(): string {
//         return "Equip";
//     }

//     /**
//      * Voert de Equip action uit op een game-object.
//      * @param {string} _alias - De alias van de action.
//      * @param {GameObject[]} gameObjects - De lijst van game-objecten waarop de action wordt uitgevoerd.
//      * @returns {ActionResult | undefined} Het resultaat van de action of een tekstresultaat als het object niet uitgerust kan worden.
//      */
//     public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
//         const gameObject: GameObject = gameObjects[0];

//         if (gameObject.instanceOf(Equippable)) {
//             return gameObject.equip();
//         }

//         return new TextActionResult(["You can't equip that."]);
//     }
// }
