import { ActionResult } from "../actionResults/ActionResult";
// import { GameObject } from "../gameObjects/GameObject";
// import { Action } from "./Action";

@Interface
export abstract class Move {
    public abstract move(): ActionResult | undefined;
}

// export class MoveAction extends Action {
//     public static readonly Alias: string = "Move";

//     public constructor() {
//         super(MoveAction.Alias, false);
//     }

//     /**
//      * @inheritdoc
//      */
//     public name(): string {
//         return "Move";
//     }

//     public execute(_alias: string, gameObjects: GameObject[]): ActionResult | undefined {
//         const gameObject: GameObject = gameObjects[0];

//         if ("move" in gameObject && typeof gameObject.move === "function") {
//             return gameObject.move();
//         }

//         return undefined;
//     }
// }
