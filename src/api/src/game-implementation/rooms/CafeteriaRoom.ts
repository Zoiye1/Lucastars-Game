import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { CleanerCharacter } from "../characters/CleanerCharacter";
import { FocusDrinkItem } from "../items/FocusDrinkItem";
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
        return ["cafeteria/CafeteriaBackground", "cafeteria/CleanerInTheWay", "cafeteria/FocusDrink"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["Welcome to the cafeteria."]);
    }

    public objects(): GameObject[] {
        return [
            new CleanerCharacter(),
            new FocusDrinkItem(),
        ];
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new TalkAction(),
            new SimpleAction("enter-courtyard", "Enter Courtyard"),
        ];
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
