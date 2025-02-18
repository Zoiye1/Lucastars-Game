import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { cookCharacter } from "../characters/cookCharacter";
import { KnifeItem } from "../items/KnifeItem";
import { SugarItem } from "../items/SugarItem";
import { StorageRoom } from "./StorageRoom";

export class KitchenRoom extends Room implements Simple {
    public static readonly Alias: string = "KitchenRoom";
    public constructor() {
        super(KitchenRoom.Alias);
    }

    public name(): string {
        return "Kitchen";
    }

    public images(): string[] {
        return ["Kitchen", "Cook", "ArrowToCafKitchen4", "KnifeKitchen", "BagOfSugar"];
    }

    public objects(): GameObject[] {
        return [new cookCharacter(),
            new KnifeItem(),
            new SugarItem(),
        ];
    }

    public actions(): Action[] {
        return [
            new ExamineAction(),
            new TalkAction(),
            new SimpleAction("storage-door", "Use storage door"),
        ];
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult([
            "You walk into the kitchen",
            "A cook is busy at the counter, focused on preparing food.",
            "At the back of the room, there’s a metal door.",
            "On top of the fridge, a bag of sugar rests, and a knife hangs from the wall.",
        ]);
    }

    public simple(alias: string): ActionResult | undefined {
        if (alias === "storage-door") {
            const room: Room = new StorageRoom();

            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }

        return undefined;
    }
}
