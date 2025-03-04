import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { HallwayRoom } from "./HallwayRoom";

export class StrangerRoom extends Room implements Simple {
    public static readonly Alias: string = "strangerroom";

    public constructor() {
        super(StrangerRoom.Alias);
    }

    public name(): string {
        return "StrangerRoom";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["room"];
    }

    public images(): string[] {
        return ["strangerroom/StrangerRoomBackground"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You walk into a room with an open door, it looks like its a room from someone else...",
            "You might be able to find something useful here"]);
    }

    public actions(): Action[] {
        return [new SimpleAction("enter-hallway", "Enter Hallway")];
    }

    public simple(alias: string): ActionResult | undefined {
        if (alias === "enter-hallway") {
            const room: Room = new HallwayRoom();

            // Set the current room to the startup room
            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }
        return undefined;
    }
}
