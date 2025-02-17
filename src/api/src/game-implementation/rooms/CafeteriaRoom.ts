import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { CourtyardRoom } from "./CourtyardRoom";

export class CafeteriaRoom extends Room implements Simple {
    public static readonly Alias: string = "cafeteria";

    public constructor() {
        super(CafeteriaRoom.Alias);
    }

    public name(): string {
        return "Cafeteria";
    }

    public images(): string[] {
        return ["cafeteria/cafeteriaInitial"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["Welcome to the cafeteria."]);
    }

    public actions(): Action[] {
        return [new SimpleAction("enter-courtyard", "Enter Courtyard")];
    }

    public simple(alias: string): ActionResult | undefined {
        if (alias === "enter-courtyard") {
            const room: Room = new CourtyardRoom();

            // Set the current room to the startup room
            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }
        return undefined;
    }
}
