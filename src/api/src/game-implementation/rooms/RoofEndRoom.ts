import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { Room } from "../../game-base/gameObjects/Room";
import { StartupRoom } from "./StartupRoom";
import { gameService } from "../../global";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class RoofEndRoom extends Room implements Simple {
    public static readonly Alias: string = "RoofEndRoom";

    public constructor() {
        super(RoofEndRoom.Alias);
    }

    public name(): string {
        return "The End";
    }

    public images(): string[] {
        return ["courtyard/courtyardBackground"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "Congratulations, you did it! 🎉",
            "Hit 'Play Again' to embark on another adventure!",
        ]);
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["room"];
    }

    public actions(): Action[] {
        return [new SimpleAction("enter-startuproom", "Play Again")];
    }

    public simple(alias: string): ActionResult | undefined {
        if (alias === "enter-startuproom") {
            gameService.resetPlayerSession();

            const room: Room = new StartupRoom();

            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }

        return undefined;
    }
}
