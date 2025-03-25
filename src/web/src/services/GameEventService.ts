import { ExecuteActionRequest, GameState } from "@shared/types";
import { GameEvent } from "../enums/GameEvent";
import { Page } from "../enums/Page";
import { BaseRouteService } from "./BaseRouteService";

/**
 * Represents the data of a Switch Page event
 */
export type SwitchPageEvent = {
    /** Page to switch to */
    page: Page;
};

/**
 * Service to allow components to communicate with eachother through events
 */
export class GameEventService extends BaseRouteService {
    /**
     * Listen for a game event and execute a function when it occurs
     *
     * @template T Type used for the event data
     *
     * @param gameEvent Kind of game event to listen for
     * @param callback Function to call when the game event occurs. Will get the event data as an argument.
     */
    public addGameEventListener<T>(
        gameEvent: GameEvent,
        callback: (event: T) => void
    ): void {
        window.addEventListener(`game:${gameEvent}`, event => {
            callback((event as CustomEvent).detail as T);
        });
    }

    /**
     * Dispatch a Switch Page event
     *
     * @param page Page to switch to
     */
    public switchPage(page: Page): void {
        this.dispatchGameEvent<SwitchPageEvent>(GameEvent.SwitchPage, {
            page: page,
        });
    }

    public async executeAction(
        actionAlias: string,
        objectAliases?: string[]
    ): Promise<GameState | undefined> {
        try {
            return await this.postJsonApi<GameState, ExecuteActionRequest>("game/action", {
                action: actionAlias,
                objects: objectAliases,
            });
        }
        catch {
            return undefined;
        }
    }

    /**
     * Dispatch a game event
     *
     * @template T Type used for the event data
     *
     * @param gameEvent Kind of game event to dispatch
     * @param data Event data to send along with the dispatch
     */
    private dispatchGameEvent<T>(gameEvent: GameEvent, data?: T): void {
        window.dispatchEvent(
            new CustomEvent(`game:${gameEvent}`, {
                detail: data,
            })
        );
    }
}
