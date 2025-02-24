import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { CafeteriaRoom } from "./CafeteriaRoom";
import { StarterRoom } from "./StarterRoom";
import { StrangerRoom } from "./Strangerroom";


export class HallwayRoom extends Room implements Simple {
    public static readonly Alias: string = "hallway";

    public constructor() {
        super(HallwayRoom.Alias);
    }

    public name(): string {
        return "Hallway";
    }

    public images(): string[] {
        return ["hallway/HallwayBackground"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["Welcome to the hallway."]);
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new SimpleAction("enter-starterroom", "Enter Starterroom"),
            new SimpleAction("enter-strangerroom", "Enter Strangerroom"),
            new SimpleAction("enter-cafeteria", "Enter Cafeteria")
        ];
    }

    public simple(alias: string): ActionResult | undefined {
        let room: Room | undefined;

        switch (alias) {
            case "enter-starterroom":
                room = new StarterRoom();
                break;
            case "enter-strangerroom":
                room = new StrangerRoom();
                break;
            case "enter-cafeteria":
                room = new CafeteriaRoom();
                break;
        }

        if (room) {
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine();
        }

        return undefined;
    }
}
