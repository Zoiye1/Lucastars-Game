import { ActionReference, DefaultGameState, GameObjectReference } from "@shared/types";
import { GameEventService } from "../services/GameEventService";
import { GameRouteService } from "../services/GameRouteService";

export class ArrowComponent extends HTMLElement {
    /** Instance of the game event service */
    private readonly _gameEventService: GameEventService = new GameEventService();
    /** Instance of the game route service */
    private readonly _gameRouteService: GameRouteService = new GameRouteService();

    /** Current game state */
    private _currentGameState?: DefaultGameState;
    /** Current active action button */
    private _selectedActionButton?: ActionReference;
    /** Current active game object buttons */
    private _selectedGameObjectButtons: Set<GameObjectReference> = new Set<GameObjectReference>();
    private render(): void {

    }
}
