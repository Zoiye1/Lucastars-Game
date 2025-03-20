import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Action } from "../../game-base/actions/Action";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { PickUpAction } from "../actions/PickUpAction";
import { PlayerSession } from "../types";
import { GlassBeakerItem } from "../items/GlassBeakerItem";
import { SulfuricAcidItem } from "../items/SulfuricAcidItem";
import { TalkAction } from "../../game-base/actions/TalkAction";
import { ProfessorCharacter } from "../characters/ProfessorCharacter";
import { BakingSodaItem } from "../items/BakingSodaItem";
import { Arrowroom } from "@shared/types";
import { UseAction } from "../actions/UseAction";
import { MetalDoorItem } from "../items/MetalDoorItem";
import { CorrosiveAcidItem } from "../items/CorrosiveAcidItem";

export class LabRoom extends Room {
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

        if (playerSession.EscapedLab) {
            result.push("lab/LabEnding");
        }

        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: Arrowroom[] = [
            { name: "Storage", alias: "StorageRoom", imageRotation: -90, imageCoords: { x: 15, y: 30 } },
        ];
        if (playerSession.EscapedLab) {
            result.push({ name: "The End", alias: "lab-end", imageRotation: 0, imageCoords: { x: 63, y: 70 } });
        };

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
        if (playerSession.inventory.includes("CorrosiveAcid")) result.push(new CorrosiveAcidItem());

        result.push(new MetalDoorItem());

        return result;
    }

    public actions(): Action[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();

        const result: Action[] = [
            new ExamineAction(),
            new PickUpAction(),
            new UseAction(),
        ];

        if (!playerSession.helpedProfessor) result.push(new TalkAction());

        return result;
    }
}
