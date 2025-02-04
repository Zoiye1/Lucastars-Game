import { GameService } from "./game-implementation/services/GameService";

/**
 * Instance of the game service, used to operate the game engine.
 *
 * @remarks Should be treated as a singleton
 */
export const gameService: GameService = new GameService();
