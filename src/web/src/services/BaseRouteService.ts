import { PlayerService } from "./PlayerService";

/**
 * Base class for services to communicate with routes of the server application
 *
 * @remarks All requests will include a header with the player session id
 */
export abstract class BaseRouteService {
    /** Instance of the player service */
    private _playerService: PlayerService = new PlayerService();

    /**
     * Perform a GET request and retrieve a JSON response
     *
     * @template T1 Return type of the function
     * @template T2 Type of query string attributes
     *
     * @param path Url to request
     * @param data Optional object to use for the query string attributes
     *
     * @returns JSON object of the response, otherwise `undefined`.
     */
    protected async getJsonApi<T1, T2 = unknown>(path: string, data?: T2): Promise<T1> {
        const response: Response = await fetch(
            `${VITE_API_URL}${path}${data ? `?${new URLSearchParams(data).toString()}` : ""}`,
            {
                method: "GET",
                headers: {
                    "X-PlayerSessionId": this._playerService.getPlayerSessionId(),
                },
            }
        );

        if (parseInt(response.headers.get("content-length")!) > 0) {
            return response.json() as T1;
        }

        // NOTE: Trick TypeScript into returning a void
        return Promise.resolve(undefined as T1);
    }

    /**
     * Perform a POST request and retrieve a JSON response
     *
     * @template T1 Return type of the function
     * @template T2 Type of request body
     *
     * @param path Url to request
     * @param data Optional object to include in the body of the request
     *
     * @returns JSON object of the response, otherwise `undefined`.
     */
    protected async postJsonApi<T1, T2 = unknown>(path: string, data?: T2): Promise<T1> {
        return this.methodJsonApi("POST", path, data);
    }

    /**
     * Perform any type of request and retrieve a JSON response
     *
     * @template T1 Return type of the function
     * @template T2 Type of request body
     *
     * @param method Method to use for the request
     * @param path Url to request
     * @param data Optional object to include in the body of the request
     *
     * @returns JSON object of the response, otherwise `undefined`.
     */
    private async methodJsonApi<T1, T2 = unknown>(method: string, path: string, data?: T2): Promise<T1> {
        const response: Response = await fetch(`${VITE_API_URL}${path}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "X-PlayerSessionId": this._playerService.getPlayerSessionId(),
            },
            body: data ? JSON.stringify(data) : undefined,
        });

        if (parseInt(response.headers.get("content-length")!) > 0) {
            return response.json() as T1;
        }

        // NOTE: Trick TypeScript into returning a void
        return Promise.resolve(undefined as T1);
    }
}
