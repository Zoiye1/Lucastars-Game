import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { PlaceAction } from "../actions/PlaceAction";
import { UseAction } from "../actions/UseAction";
import { SmokerCharacter } from "../characters/SmokerCharacter";
import { JumpRopeItem } from "../items/JumpRopeItem";
import { TreeItem } from "../items/TreeItem";
import { PlayerSession } from "../types";
import { CafeteriaRoom } from "./CafeteriaRoom";
import { CourtyardTheEndRoom } from "./CourtyardTheEndRoom";

export class CourtyardRoom extends Room implements Simple {
    public static readonly Alias: string = "courtyard";

    public constructor() {
        super(CourtyardRoom.Alias);
    }

    public name(): string {
        return "Courtyard";
    }

    /**
     * Geeft de types van de GameObject terug
     *
     * @returns De types van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["room"];
    }

    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["courtyard/courtyardBackground", "courtyard/Smoker"];

        if (!playerSession.pickedUpJumpRope) {
            result.push("courtyard/JumpRope");
        }
        if (playerSession.placedEscapeLadder) {
            result.push("courtyard/EscapeLadder");
        }

        return result;
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["Welcome to the courtyard."]);
    }

    /**
     * Geeft de objecten terug die zich in deze kamer bevinden
     *
     * @returns Een array van game objecten, zoals de smoker en de jump rope, als die aanwezig zijn
     */
    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [new SmokerCharacter(), new TreeItem()];

        if (!playerSession.pickedUpJumpRope) {
            result.push(new JumpRopeItem());
        }

        return result;
    }

    public actions(): Action[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        const result: Action[] = [
            new ExamineAction(),
            new TalkAction(),
            new PickUpAction(),
            new SimpleAction("enter-cafeteria", "Return to cafeteria"),
        ];

        if (playerSession.inventory.includes("HammerItem")) result.push(new UseAction());
        if (playerSession.inventory.includes("LadderItem")) result.push(new PlaceAction());
        if (playerSession.placedEscapeLadder) result.push(new SimpleAction("enter-end", "Escape"));

        return result;
    }

    public simple(alias: string): ActionResult | undefined {
        let room: Room | undefined;

        switch (alias) {
            case "enter-cafeteria":
                room = new CafeteriaRoom();
                break;
            case "enter-end":
                room = new CourtyardTheEndRoom();
                break;
        }

        if (room) {
            gameService.getPlayerSession().currentRoom = room.alias;
            return room.examine();
        }

        return undefined;
    }
}
