import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { Room } from "../../game-base/gameObjects/Room";
import { StartupRoom } from "./StartupRoom";
import { gameService } from "../../global";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class GymTheEndRoom extends Room implements Simple {
    public type(): GameObjectType[] {
        return ["room"];
    }

    public static readonly Alias: string = "GymEnd";

    public constructor() {
        super(GymTheEndRoom.Alias);
    }

    public name(): string {
        return "The End";
    }

    public images(): string[] {
        return ["gif/GymEndRoom"];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "Congratulations, you did it! 🎉",
            "Hit 'Play Again' to embark on another adventure!",
        ]);
    }

    public actions(): Action[] {
        return [new SimpleAction("enter-startuproom", "Play Again")];
    }

    public simple(alias: string): ActionResult | undefined {
        if (alias === "enter-startuproom") {
            // Reset de PlayerSession
            gameService.resetPlayerSession();

            // Maak een nieuwe startup room aan
            const room: Room = new StartupRoom();

            // Zet de nieuwe kamer als startpunt
            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }

        return undefined;
    }
}
