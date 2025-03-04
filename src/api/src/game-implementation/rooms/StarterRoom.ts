import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { ForkItem } from "../items/ForkItem";
import { PaintingItem } from "../items/PaintingItem";
import { HallwayRoom } from "./HallwayRoom";
import { PickUpAction } from "../actions/PickUpAction";
import { PlayerSession } from "../types";
import { VentsRoom } from "./VentsRoom";
import { VentItem } from "../items/VentItem";
import { WindowItem } from "../items/WindowItem";
import { UseAction } from "../actions/UseAction";

export class StarterRoom extends Room implements Simple {
    public static readonly Alias: string = "starterroom";

    public constructor() {
        super(StarterRoom.Alias);
    }

    public name(): string {
        return "Starterroom";
    }

    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = [];

        // Choose background based on which access points are unlocked
        if (playerSession.windowBroken && playerSession.ventUnlocked) {
            // Both unlocked
            result.push("starterroom/StarterRoomBackground4");
        }
        else if (playerSession.windowBroken) {
            // Only hallway unlocked
            result.push("starterroom/StarterRoomBackground2");
        }
        else if (playerSession.ventUnlocked) {
            // Only vents unlocked
            result.push("starterroom/StarterRoomBackground3");
        }
        else {
            // Nothing unlocked
            result.push("starterroom/StarterRoomBackground");
        }

        // Add pickable items if they haven't been picked up yet
        if (!playerSession.pickedUpFork) {
            result.push("starterroom/StarterRoomFork");
        }

        if (!playerSession.pickedUpPainting) {
            result.push("starterroom/StarterRoomPainting");
        }

        return result;
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You wake up with a pounding headache",
            "You have no idea where you are. Your head throbs as you glance around the room.",
            "The door is locked. You need to find a way out!",
        ]);
    }

    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [];

        if (!playerSession.pickedUpFork) {
            result.push(new ForkItem());
        }

        if (!playerSession.pickedUpPainting) {
            result.push(new PaintingItem());
        }

        // Always add the vent and window as interaction objects
        result.push(new VentItem());
        result.push(new WindowItem());

        return result;
    }

    public actions(): Action[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const actions: Action[] = [
            new ExamineAction(),
            new PickUpAction(),
            new UseAction(),
        ];

        // Only show these buttons if the corresponding objects are unlocked
        if (playerSession.ventUnlocked) {
            actions.push(new SimpleAction("enter-vent", "Enter Vent"));
        }

        if (playerSession.windowBroken) {
            actions.push(new SimpleAction("enter-hallway", "Enter Hallway"));
        }

        return actions;
    }

    public simple(alias: string): ActionResult | undefined {
        switch (alias) {
            case "enter-hallway": {
                const room = new HallwayRoom();
                gameService.getPlayerSession().currentRoom = room.alias;
                return room.examine();
            }
            case "enter-vent": {
                const room = new VentsRoom();
                gameService.getPlayerSession().currentRoom = room.alias;
                return room.examine();
            }
        }

        return undefined;
    }
}
