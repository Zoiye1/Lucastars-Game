import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { StarterRoom } from "./StarterRoom";
import { RoofRoom } from "./RoofRoom";

export class VentsRoom extends Room implements Simple {
    public static readonly Alias: string = "Vents";

    public constructor() {
        super(VentsRoom.Alias);
    }

    public name(): string {
        return "Vents";
    }

    public images(): string[] {
        return ["vents/VentsBackground"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You are now in the Vents, you have to make a choice... Left or Right?"]);
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new SimpleAction("go-left", "Go Left"),
            new SimpleAction("go-right", "Go Right"),
            new SimpleAction("go-back", "Go Right"),

        ];
    }

    public simple(alias: string): ActionResult | undefined {
        let room: Room | undefined;

        switch (alias) {
            case "go-left":
                room = new StarterRoom();
                break;
            case "go-right":
                room = new RoofRoom();
                break;
            case "go-back":
                room = new StarterRoom();
                break;
        }

        if (room) {
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine();
        }

        return undefined;
    }
}
