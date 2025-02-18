import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { KitchenRoom } from "./KitchenRoom";

export class StorageRoom extends Room implements Simple {
    public static readonly Alias: string = "StorageRoom";

    public constructor() {
        super(StorageRoom.Alias);
    }

    public name(): string {
        return "StorageRoom";
    }

    public images(): string[] {
        return ["titlescreen"];
    }

    public actions(): Action[] {
        return [new SimpleAction("Kitchen-enter", "Go to Kitchen")];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You enter the Storage"]);
    }

    public simple(alias: string): ActionResult | undefined {
        if (alias === "Kitchen-enter") {
            const room: Room = new KitchenRoom();

            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }

        return undefined;
    }
}
