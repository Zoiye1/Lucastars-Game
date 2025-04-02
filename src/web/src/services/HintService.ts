import { GameRouteService } from "./GameRouteService";
import { PlayerSession } from "../components/HintComponent";

/**
 * Service om te communiceren met hint routes
 */
export class HintRouteService extends GameRouteService {
    /**
     * Haal het geselecteerde item op voor de speler
     *
     * @returns Een string die het geselecteerde item representeert
     */
    public async getPlayerSession(): Promise<PlayerSession | undefined> {
        return this.getJsonApi<PlayerSession | undefined>("game/hint");
    }
}
