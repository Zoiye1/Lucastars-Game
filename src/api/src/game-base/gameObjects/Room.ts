import { ArrowRoom } from "@shared/types";
import { ActionResult } from "../actionResults/ActionResult";
import { Action } from "../actions/Action";
import { Examine } from "../actions/ExamineAction";
import { GameObject } from "./GameObject";

/**
 * Base class used to represent a room
 *
 * @remarks Implements the Examine action by default
 */
export abstract class Room extends GameObject implements Examine {
    /**
     * Create a new instance of this room
     *
     * @param alias Alias of this room
     */
    protected constructor(alias: string) {
        super(alias);
    }

    /**
     * Get the images used to graphically represent this room
     *
     * @returns List of images
     */
    public images(): SyncOrAsync<string[]> {
        return [];
    }

    public ArrowUrl(): ArrowRoom[] {
        return [
            { ImageLocation: "", OnClickEvent: "" },
        ];
    }

    /**
     * Get the actions that can be used in this room
     *
     * @returns List of actions
     */
    public actions(): SyncOrAsync<Action[]> {
        return [];
    }

    /**
     * Get the game objects that are located inside this room
     *
     * @returns List of game objects
     */
    public objects(): SyncOrAsync<GameObject[]> {
        return [];
    }

    /**
     * @inheritdoc
     */
    public abstract examine(): ActionResult | undefined;
}
