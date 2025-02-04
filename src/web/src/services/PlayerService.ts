/**
 * Service to handle anything player related
 */
export class PlayerService {
    /**
     * Get the stored player session id, otherwise create a new one and store it.
     *
     * @returns A player session id
     */
    public getPlayerSessionId(): string {
        let playerSessionId: string | null = localStorage.getItem("playerSessionId");

        if (!playerSessionId) {
            playerSessionId = crypto.randomUUID();

            localStorage.setItem("playerSessionId", playerSessionId);
        }

        return playerSessionId;
    }
}
