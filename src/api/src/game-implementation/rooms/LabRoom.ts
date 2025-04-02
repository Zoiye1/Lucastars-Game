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
import { Arrowroom, ClickItem } from "@shared/types";
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
        // const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: string[] = ["lab/labBackground1"];
        const playerSession: PlayerSession = gameService.getPlayerSession();

        if (playerSession.EscapedLab) {
            result.push("gif/LabEnding");
        }

        return result;
    }

    public ClickItem(): ClickItem[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        // Always give 4 paramaters for Click objects: The name (will be displayed), alias,
        // The imageurl and the types

        // result as an array of ClickItem objects
        const result: ClickItem[] = [
            { name: "Professor", alias: "Professor", imageUrl: "gif/ProfessorIdle", type: ["npc"], imageCoords: { x: 30, y: 30 } },
        ];
        if (!playerSession.pickedUpSulfuricAcid) {
            result.push({ name: "SulfuricAcid", alias: "SulfuricAcidItem", imageUrl: "lab/labSulfuricAcid", type: ["actionableItem"], imageCoords: { x: 20, y: 24 } });
        }
        if (!playerSession.pickedUpGlassBeaker) {
            result.push({ name: "GlassBeaker", alias: "GlassBeakerItem", imageUrl: "lab/labGlassBeaker", type: ["actionableItem"], imageCoords: { x: 20, y: 85 } });
        }

        return result;
    }

    public ArrowUrl(): Arrowroom[] {
        // Initialize result as an array of Arrowroom objects
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const result: Arrowroom[] = [
            { name: "Storage", alias: "StorageRoom", imageRotation: -90, imageCoords: { x: 3, y: 50 } },
        ];
        if (playerSession.EscapedLab) {
            result.push({ name: "The End", alias: "lab-end", imageRotation: 0, imageCoords: { x: 70, y: 70 } });
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
