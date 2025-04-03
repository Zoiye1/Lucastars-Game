import { ActionReference, ExecuteActionRequest, GameObjectReference, GameState } from "@shared/types";
import { Request, Response } from "express";
import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TalkActionResult } from "../../game-base/actionResults/TalkActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { ExamineAction } from "../../game-base/actions/ExamineAction";
import { GameObject } from "../../game-base/gameObjects/GameObject";
import { Room } from "../../game-base/gameObjects/Room";
import { gameService } from "../../global";
import { SwitchPageActionResult } from "../actionResults/SwitchPageActionResult";
import { Action } from "../../game-base/actions/Action";
import { TalkChoice } from "../../game-base/actions/TalkAction";
import { PlayerSession } from "../types";
import { ShowInventoryActionResult, ShowTargetsActionResult } from "../actionResults/InventoryActionResult";
import { UseAction } from "../actions/UseAction";
import { Character } from "../../game-base/gameObjects/Character";

/**
 * Controller om alle spelgerelateerde verzoeken af te handelen
 */

type QuestArray = {
    NPC: string;
    startQuest: boolean;
    completed: boolean;
    description: string;
    reward: string;
};

export class GameController {
    /**
     * Verwerk het verzoek om de spelstatus voor de huidige speler op te halen
     *
     * @remarks Response is een 200 met een `GameState` bij succes, anders een 500.
     */
    public async handleStateRequest(_: Request, res: Response): Promise<void> {
        // Voer de Examine-actie uit op de huidige kamer
        const gameState: GameState | undefined = await this.executeAction(ExamineAction.Alias);

        if (gameState) {
            res.json(gameState);
        }
        else {
            res.status(500).end();
        }
    }

    /**
     * Verwerk het verzoek om een actie uit te voeren voor de huidige speler
     *
     * @remarks Response is een 200 met een `GameState` bij succes, anders een 500.
     */
    public async handleActionRequest(req: Request, res: Response): Promise<void> {
        // Haal de gegevens uit het verzoek op
        const executeActionRequest: ExecuteActionRequest = req.body as ExecuteActionRequest;

        // Voer de gevraagde actie uit op de opgegeven spelobjecten
        const gameState: GameState | undefined = await this.executeAction(
            executeActionRequest.action,
            executeActionRequest.objects
        );

        if (gameState) {
            res.json(gameState);
        }
        else {
            res.status(500).end();
        }
    }

    /**
     * Voer de gevraagde actie uit en zet het resultaat om in een type `GameState`.
     *
     * @param actionAlias Alias van de uit te voeren actie
     * @param gameObjectAliases Optionele lijst met aliassen van spelobjecten waarop de actie moet worden uitgevoerd
     *
     * @returns Een type `GameState` dat het resultaat van de actie vertegenwoordigt of `undefined` als er iets fout ging.
     */
    protected async executeAction(actionAlias: string, gameObjectAliases?: string[]): Promise<GameState | undefined> {
        // Als er geen object-aliassen zijn opgegeven, gebruik dan de huidige kamer
        console.log(actionAlias);
        if (!gameObjectAliases || gameObjectAliases.length === 0) {
            gameObjectAliases = [gameService.getPlayerSession().currentRoom];
        }

        console.log(gameObjectAliases);

        // Haal de spelobjecten op via de aliassen
        const gameObjects: GameObject[] = gameService.getGameObjectsByAliases(gameObjectAliases);

        // Als er geen objecten gevonden zijn, is het verzoek ongeldig
        if (gameObjects.length === 0) {
            console.error("[error][GameController::executeAction] Geen spelobjecten gevonden!");

            return undefined;
        }

        // Laat de game engine de actie uitvoeren. Het is belangrijk om hier "await" te gebruiken, omdat sommige acties asynchroon kunnen zijn!
        const actionResult: ActionResult | undefined = await gameService.executeAction(
            actionAlias,
            gameObjects
        );

        // Zet het resultaat van de actie om naar een nieuwe spelstatus
        return this.convertActionResultToGameState(actionResult);
    }

    /**
     * Zet het resultaat van een actie om naar een type `GameState`.
     *
     * @param actionResult Resultaat van een actie, kan `undefined` zijn.
     *
     * @returns Een type `GameState` dat het resultaat van de actie vertegenwoordigt of `undefined` als er iets fout ging.
     */
    private async convertActionResultToGameState(actionResult?: ActionResult): Promise<GameState | undefined> {
        // Haal de huidige kamer op, nodig voor de achtergronden in alle gevallen
        const currentRoom: Room | undefined = gameService.getGameObjectByAlias(
            gameService.getPlayerSession().currentRoom
        ) as Room | undefined;

        // Als er geen huidige kamer is gevonden, is het verzoek ongeldig
        if (!currentRoom) {
            console.error("[error][GameController::convertActionResultToGameState] Geen huidige kamer gevonden!");
            return undefined;
        }

        // Haal de achtergrondafbeeldingen van de kamer op voor gebruik in alle spelstaten
        const roomImages: string[] = await currentRoom.images();

        // Verwerk ShowInventoryActionResult om inventarisobjecten te tonen
        if (actionResult instanceof ShowInventoryActionResult) {
            const inventoryItems: GameObject[] = actionResult.inventoryItems;
            const inventoryReferences: GameObjectReference[] = [];

            for (const item of inventoryItems) {
                inventoryReferences.push(await this.convertGameObjectToReference(item));
            }

            // Maak acties aan voor elk inventarisobject
            const actions: ActionReference[] = [];
            for (const itemRef of inventoryReferences) {
                actions.push({
                    alias: `${UseAction.SelectInventoryPrefix}${itemRef.alias}`,
                    name: `Use ${itemRef.name}`,
                    needsObject: false,
                });
            }

            return {
                type: "inventory-selection",
                text: ["Select an item to use:"],
                objects: inventoryReferences,
                actions: actions,
                roomAlias: gameService.getPlayerSession().currentRoom,
                roomName: "Inventory Selection",
                roomImages: roomImages, // Gebruik de afbeeldingen van de huidige kamer
                roomArrowImages: currentRoom.ArrowUrl(),
                roomClickImages: currentRoom.ClickItem(),
            } as unknown as GameState;
        }

        // Verwerk ShowTargetsActionResult om doelobjecten in de kamer te tonen
        if (actionResult instanceof ShowTargetsActionResult) {
            const sourceItem: GameObject = actionResult.sourceItem;
            const targetItems: GameObject[] = actionResult.targetItems;

            const targetRefs: GameObjectReference[] = [];

            for (const item of targetItems) {
                targetRefs.push(await this.convertGameObjectToReference(item));
            }

            // Maak acties aan voor elk doelobject
            const actions: ActionReference[] = [];
            for (const targetRef of targetRefs) {
                actions.push({
                    alias: `${UseAction.UseWithPrefix}${sourceItem.alias}:${targetRef.alias}`,
                    name: `Use on ${targetRef.name}`,
                    needsObject: false,
                });
            }

            return {
                type: "target-selection",
                text: [`Select where to use the ${await sourceItem.name()}:`],
                objects: targetRefs,
                actions: actions,
                roomAlias: gameService.getPlayerSession().currentRoom,
                roomName: "Target Selection",
                roomImages: roomImages, // Gebruik de afbeeldingen van de huidige kamer
                roomArrowImages: currentRoom.ArrowUrl(),
                roomClickImages: currentRoom.ClickItem(),
            } as unknown as GameState;
        }

        // Verwerk SwitchPageActionResult als de client-applicatie van pagina moet wisselen
        if (actionResult instanceof SwitchPageActionResult) {
            return {
                type: "switch-page",
                page: actionResult.page,
            };
        }

        // Bepaal de tekst die aan de speler getoond moet worden
        let text: string[];

        if (actionResult instanceof TextActionResult) {
            text = actionResult.text;
        }
        else {
            text = ["Dat slaat nergens op."];
        }

        // Bepaal de acties die aan de speler getoond moeten worden
        let actions: ActionReference[];

        if (actionResult instanceof TalkActionResult) {
            actions = actionResult.choices.map(e => this.convertTalkChoiceToReference(actionResult, e));
        }
        else {
            actions = [];

            for (const action of await currentRoom.actions()) {
                actions.push(await this.convertActionToReference(action));
            }
        }

        // Bepaal de spelobjecten die aan de speler getoond moeten worden
        const objects: GameObjectReference[] = [];

        for (const object of await currentRoom.objects()) {
            objects.push(await this.convertGameObjectToReference(object));
        }

        // Combineer alle data in een spelstatus
        return {
            type: "default",
            roomAlias: currentRoom.alias,
            roomName: await currentRoom.name(),
            roomImages: roomImages,
            roomArrowImages: currentRoom.ArrowUrl(),
            roomClickImages: currentRoom.ClickItem(),
            text: text,
            actions: actions,
            objects: objects,
        };
    }

    /**
     * Zet een actie-instantie om in een actie-referentie voor de client-applicatie
     *
     * @param action Actie-instantie om te converteren
     *
     * @returns Actie-referentie voor de client-applicatie
     */
    private async convertActionToReference(action: Action): Promise<ActionReference> {
        return {
            alias: action.alias,
            name: await action.name(),
            needsObject: action.needsObject,
        };
    }

    /**
     * Zet een gespreksoptie om in een actie-referentie voor de client-applicatie
     *
     * @param talkResult Het gespreksresultaat met de gesprekscontext
     * @param choice Gespreksoptie om te converteren
     *
     * @returns Actie-referentie voor de client-applicatie
     */
    private convertTalkChoiceToReference(talkResult: TalkActionResult, choice: TalkChoice): ActionReference {
        // Haal het personage op uit het gespreksresultaat
        const character: Character = talkResult.character;

        return {
            alias: choice.toAlias(character),
            name: choice.text,
            needsObject: false,
        };
    }

    /**
     * Zet een spelobject-instantie om in een spelobject-referentie voor de client-applicatie
     *
     * @param gameObject Spelobject-instantie om te converteren
     *
     * @returns Spelobject-referentie voor de client-applicatie
     */
    private async convertGameObjectToReference(gameObject: GameObject): Promise<GameObjectReference> {
        return {
            alias: gameObject.alias,
            name: await gameObject.name(),
            type: await gameObject.type(),
        };
    }

    // Voeg de nieuwe methoden toe
    public getActiveQuests(_: Request, res: Response): QuestArray[] {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const questArray: QuestArray[] = [
            {
                NPC: "cleaner",
                startQuest: playerSession.wantsToHelpCleaner,
                completed: playerSession.helpedCleaner,
                description: "Zoek de emmer met water en help de schoonmaker.",
                reward: "Beloning: Toegang tot keuken + 1x 10 euro biljet.",
            },
            {
                NPC: "dealer",
                startQuest: !!playerSession.wantsToHelpDealer2,
                completed: !!playerSession.helpedDealer2,
                description: "Geef de dealer een biljet van 10 euro.",
                reward: "Beloning: + 1x pakje sigaretten.",
            },
            {
                NPC: "cook",
                startQuest: !!playerSession.wantsToHelpCook,
                completed: (!!playerSession.helpedCook || playerSession.ThreatenedCook),
                description: "Vind de vork of vind een andere manier om de sleutel van de kok te krijgen.",
                reward: "Beloning: Toegang tot de opslagruimte.",
            },
            {
                NPC: "gymfreak",
                startQuest: !!playerSession.wantsToHelpGymFreak,
                completed: playerSession.helpedGymFreak,
                description: "Geef de dealer wat steroïden.",
                reward: "Beloning: Ontsnap uit het ziekenhuis!",
            },
            {
                NPC: "professor",
                startQuest: !!playerSession.wantsToHelpProfessor,
                completed: playerSession.helpedProfessor,
                description: "Breng de benodigde ingrediënten naar de professor.",
                reward: "Beloning: + 1x bijtend zuur",
            },
            {
                NPC: "smoker",
                startQuest: !!playerSession.wantsToHelpSmoker,
                completed: !!playerSession.helpedSmoker,
                description: "Geef de dealer een pakje sigaretten.",
                reward: "Beloning: + 1x aansteker",
            },
            {
                NPC: "dealer",
                startQuest: !!playerSession.wantsToHelpDealer,
                completed: !!playerSession.helpedDealer,
                description: "Vind de suiker en praat met de dealer.",
                reward: "Beloning: + 1x steroïden.",
            },
        ];
        res.json(questArray);
        return questArray;
    }
}
