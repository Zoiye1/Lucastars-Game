import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { CafeteriaRoom } from "./CafeteriaRoom";

export class CourtyardRoom extends Room implements Simple {
    public static readonly Alias: string = "courtyard";

    public constructor() {
        super(CourtyardRoom.Alias);
    }

    public name(): string {
        return "Courtyard";
    }

    /**
     * Geeft de types van de GameObject terug
     *
     * @returns De types van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["room"];
    }

    public images(): string[] {
        return ["courtyard/courtyardInitial"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["Welcome to the courtyard."]);
    }

    public actions(): Action[] {
        return [new SimpleAction("enter-cafeteria", "Enter Cafeteria")];
    }

    public simple(alias: string): ActionResult | undefined {
        if (alias === "enter-cafeteria") {
            const room: Room = new CafeteriaRoom();

            // Set the current room to the startup room
            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }
        return undefined;
    }
}
