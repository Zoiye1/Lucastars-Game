import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { CafeteriaRoom } from "./CafeteriaRoom";
import { StarterRoom } from "./StarterRoom";
import { StrangerRoom } from "./StrangerRoom";
import { ToiletRoom } from "./ToiletRoom";

export class HallwayRoom extends Room implements Simple {
    public static readonly Alias: string = "hallway";

    public constructor() {
        super(HallwayRoom.Alias);
    }

    public name(): string {
        return "Hallway";
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
        return ["hallway/HallwayBackground"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["he hallway goes in many directions. Which way will you go?"]);
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new SimpleAction("enter-starterroom", "Enter Starterroom"),
            new SimpleAction("enter-strangerroom", "Enter Strangerroom"),
            new SimpleAction("enter-cafeteria", "Enter Cafeteria"),
            new SimpleAction("enter-toilet", "Enter Toilet"),
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
            case "enter-toilet":
                room = new ToiletRoom();
        }

        if (room) {
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine();
        }

        return undefined;
    }
}
