import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { Simple, SimpleAction } from "../../game-base/actions/SimpleAction";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { PlayerSession } from "../types";
import { GlassBeakerItem } from "../items/GlassBeakerItem";
import { SulfuricAcidItem } from "../items/SulfuricAcidItem";
import { StorageRoom } from "./StorageRoom";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { ProfessorCharacter } from "../characters/ProfessorCharacter";
import { BakingSodaItem } from "../items/BakingSodaItem";
import { Arrowroom } from "@shared/types";

export class LabRoom extends Room implements Simple {
    public static readonly Alias: string = "labroom";

    public constructor() {
        super(LabRoom.Alias);
    }

    public name(): string {
        return "The Lab";
    }

    /**
     * Geeft de type van de GameObject terug
     *
     * @returns De type van de GameObject (GameObjectType union)
     */
    public type(): GameObjectType[] {
        return ["room"];
    }

    public images(): string[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["lab/labBackground1", "lab/labProfessor"];

        if (!playerSession.pickedUpSulfuricAcid) {
            result.push("lab/labSulfuricAcid");
        }

        if (!playerSession.pickedUpGlassBeaker) {
            result.push("lab/labGlassBeaker");
        }

        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const result: Arrowroom[] = [
            { name: "Storage", alias: "StorageRoom", imageRotation: 180, imageCoords: { x: 63, y: 15 } },
        ];

        return result;
    }

    public examine(): ActionResult | undefined {
        return new TextActionResult(["You walk into a mysterious lab...",
        ]);
    }

    public objects(): GameObject[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: GameObject[] = [new ProfessorCharacter()];

        if (!playerSession.pickedUpGlassBeaker) {
            result.push(new GlassBeakerItem());
        }

        if (!playerSession.pickedUpSulfuricAcid) {
            result.push(new SulfuricAcidItem());
        }
        if (!playerSession.pickedUpBakingSoda) {
            result.push(new BakingSodaItem());
        }
        return result;
    }

    public actions(): Action[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        const result: Action[] = [
            new ExamineAction(),
            new PickUpAction(),
            new SimpleAction("enter-storage", "Enter Storage"),
        ];

        if (!playerSession.helpedProfessor) result.push(new TalkAction());

        return result;
    }

    public simple(alias: string): ActionResult | undefined {
        if (alias === "enter-storage") {
            const room: Room = new StorageRoom();

            gameService.getPlayerSession().currentRoom = room.alias;

            return room.examine();
        }
        return undefined;
    }
}
