import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { Room } from "../../game-base/gameObjects/Room";
import { StartupRoom } from "./StartupRoom";
import { gameService } from "../../global";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";

/**
 * Class representeert de end room bij de courtyard.
 *
 *  @remarks Dit is een einde room, de speler heeft de spel uitgespeeld.
 */
export class CourtyardTheEndRoom extends Room implements Simple {
    /** Alias van deze kamer */
    public static readonly Alias: string = "courtyard-end";

    public constructor() {
        super(CourtyardTheEndRoom.Alias);
    }

    /**
     * Geeft de naam van de kamer terug
     *
     * @returns De string "The End"
     */
    public name(): string {
        return "The End";
    }

    /**
     * Geeft de afbeeldingen die worden gebruikt voor de kamer door aan de game engine
     *
     * @returns Een array met afbeeldinglocaties als string
     */
    public images(): string[] {
        return ["courtyard/courtyardTheEnd"];
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

    /**
     * Geeft een array van actions die beschikbaar zijn in deze kamer
     *
     * @returns Een array van mogelijke actions, in dit geval play again alleen
     */
    public actions(): Action[] {
        return [new SimpleAction("enter-startuproom", "Play Again")];
    }

    /**
     * Zorgt ervoor dat de speler opnieuw het spel kan spelen.
     *
     * @returns een simple ActionResult terug waardoor de speler opnieuw kan spelen.
     */
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
