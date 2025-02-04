import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";

/**
 * Implemention of the startup room
 *
 * @remarks Used as the first room for new player sessions.
 */
export class StartupRoom extends Room implements Simple {
    /** Alias of this room */
    public static readonly Alias: string = "startup";

    /**
     * Create a new instance of this room
     */
    public constructor() {
        super(StartupRoom.Alias);
    }

    /**
     * @inheritdoc
     */
    public name(): string {
        return "Example Game";
    }

    /**
     * @inheritdoc
     */
    public images(): string[] {
        return ["startup"];
    }

    /**
     * @inheritdoc
     */
    public actions(): Action[] {
        return [new SimpleAction("start-game", "Start Game")];
    }

    /**
     * @inheritdoc
     */
    public examine(): ActionResult | undefined {
        return new TextActionResult(["This is an example."]);
    }

    /**
     * @inheritdoc
     */
    public simple(alias: string): ActionResult | undefined {
        if (alias === "start-game") {
            // TODO: Change this to the actual first room of the game
            const room: Room = new StartupRoom();

            // Set the current room to the startup room
            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }

        return undefined;
    }
}
