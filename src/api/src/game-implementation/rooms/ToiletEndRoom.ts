import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { Room } from "../../game-base/gameObjects/Room";
import { StartupRoom } from "./StartupRoom";
import { gameService } from "../../global";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

export class ToiletEndRoom extends Room implements Simple {
    public static readonly Alias: string = "toilet-end"; // Unieke identifier voor de kamer

    public constructor() {
        super(ToiletEndRoom.Alias); // Roep de constructor van de bovenliggende klasse aan met de alias
    }

    public name(): string {
        return "The End"; // Retourneer de naam van de kamer
    }

    public images(): string[] {
        return ["toilet/ToiletEnding"]; // Geef de afbeelding van de kamer terug
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "Congratulations, you did it! 🎉",
            "Hit 'Play Again' to embark on another adventure!",
        ]);
    }

    public type(): GameObjectType[] {
        return ["room"]; // Geef het type van de GameObject terug
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
