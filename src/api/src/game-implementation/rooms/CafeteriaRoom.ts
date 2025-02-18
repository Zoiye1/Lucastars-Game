import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { CleanerCharacter } from "../characters/CleanerCharacter";
import { FocusDrinkItem } from "../items/FocusDrinkItem";
import { PlayerSession } from "../types";
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
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["cafeteria/CafeteriaBackground"];

        if (!playerSession.helpedCleaner) {
            result.push("cafeteria/CleanerInTheWay");
        }
        if (!playerSession.pickedUpFocusDrink) {
            result.push("cafeteria/FocusDrink");
        }

        return result;
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["Welcome to the cafeteria."]);
    }

    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [new CleanerCharacter()];

        if (!playerSession.pickedUpFocusDrink) {
            result.push(new FocusDrinkItem());
        }
        return result;
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new TalkAction(),
            new PickUpAction(),
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
