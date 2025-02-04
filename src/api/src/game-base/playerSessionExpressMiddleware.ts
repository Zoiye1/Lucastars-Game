/**
 * This file exposes a middleware for Express to:
 * - Associate a `PlayerSession` with a request, based on the provided `X-PlayerSessionId`-header.
 * - Regularly persist player sessions as JSON-files on the file system
 *
 * @remarks This file contains a lot of complex logic. You do not have to understand how it works!
 */
import { AsyncLocalStorage } from "async_hooks";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Request, Response, NextFunction } from "express";

export type PlayerSessionType = Record<string, unknown>;

type CreatePlayerSession = () => PlayerSessionType;

export type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

type CacheItem<T> = {
    lastAccessed: number;
    item: T;
};

class AsyncPlayerSessionStorage<T> {
    private readonly playerSessions: Record<string, CacheItem<T>> = {};
    private readonly dirtyPlayerSessions: Set<string> = new Set();

    public constructor() {
        if (!existsSync(sessionsDirectory)) {
            mkdirSync(sessionsDirectory);
        }

        this.restartThread();
    }

    public get(id: string): T | undefined {
        if (!(id in this.playerSessions)) {
            return undefined;
        }

        const playerSession: CacheItem<T> = this.playerSessions[id];
        playerSession.lastAccessed = new Date().getTime();

        return playerSession.item;
    }

    public load(id: string): T | undefined {
        const filePath: string = join(sessionsDirectory, `${id}.json`);

        if (existsSync(filePath)) {
            try {
                const playerSessionData: string = readFileSync(filePath, "utf-8");
                const playerSession: T = JSON.parse(playerSessionData) as T;

                this.playerSessions[id] = {
                    lastAccessed: new Date().getTime(),
                    item: playerSession,
                };

                return playerSession;
            }
            catch {
                return undefined;
            }
        }

        return undefined;
    }

    public add(id: string, playerSession: T): void {
        this.playerSessions[id] = {
            lastAccessed: new Date().getTime(),
            item: playerSession,
        };

        this.markDirty(id);
    }

    public markDirty(id: string): void {
        this.dirtyPlayerSessions.add(id);
    }

    private restartThread(): void {
        setTimeout(this.handleThread.bind(this), threadTimer);
    }

    private handleThread(): void {
        // Save player sessions
        const dirtyIds: string[] = Array.from(this.dirtyPlayerSessions);

        dirtyIds.forEach(id => {
            this.save(id);

            this.dirtyPlayerSessions.delete(id);
        });

        // Unload player sessions
        const cacheItems: [string, CacheItem<T>][] = Object.entries(this.playerSessions);

        const currentTime: number = new Date().getTime();

        cacheItems.forEach(kvp => {
            if (currentTime - kvp[1].lastAccessed > unloadTimer) {
                delete this.playerSessions[kvp[0]];
            }
        });

        this.restartThread();
    }

    private save(id: string): void {
        const playerSession: T | undefined = this.get(id);

        if (!playerSession) {
            return;
        }

        writeFileSync(join(sessionsDirectory, `${id}.json`), JSON.stringify(playerSession));
    }
}

const sessionsDirectory: string = "sessions";
const threadTimer: number = 5 * 1000; // NOTE: Restart the thread every 5 seconds
const unloadTimer: number = 60 * 60 * 1000; // NOTE: Unload player sessions after 1 hour

const asyncPlayerSessionStorage: AsyncPlayerSessionStorage<PlayerSessionType> = new AsyncPlayerSessionStorage();
const asyncPlayerSessionContext: AsyncLocalStorage<PlayerSessionType> = new AsyncLocalStorage();

export function getPlayerSessionFromContext<T>(): T {
    return asyncPlayerSessionContext.getStore() as T;
}

export function resetPlayerSessionInContext(createPlayerSession: CreatePlayerSession): void {
    const playerSession: PlayerSessionType = getPlayerSessionFromContext();

    Object.keys(playerSession).forEach(key => delete playerSession[key]);

    Object.assign(playerSession, createPlayerSession());
}

export function playerSessionMiddleware(
    alias: string,
    createPlayerSession: CreatePlayerSession
): ExpressMiddleware {
    return (req, res, next): void => {
        const PlayerSessionIdHeader: string | undefined = req.headers["x-playersessionid"] as string;

        if (!PlayerSessionIdHeader) {
            res.status(400).end();

            return;
        }

        const playerSessionId: string = `${alias}-${PlayerSessionIdHeader}`;

        let playerSession: PlayerSessionType | undefined = asyncPlayerSessionStorage.get(playerSessionId);

        if (!playerSession) {
            playerSession = asyncPlayerSessionStorage.load(playerSessionId);

            if (!playerSession) {
                playerSession = createPlayerSession();

                asyncPlayerSessionStorage.add(playerSessionId, playerSession);
            }
        }

        asyncPlayerSessionContext.run(playerSession, () => {
            const oldPlayerSession: string = JSON.stringify(playerSession);

            next();

            const newPlayerSession: string = JSON.stringify(playerSession);

            // NOTE: Poor-man's dirty check
            if (oldPlayerSession !== newPlayerSession) {
                asyncPlayerSessionStorage.markDirty(playerSessionId);
            }
        });
    };
}
