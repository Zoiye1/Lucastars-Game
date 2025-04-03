import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { GameObject } from "../../game-base/gameObjects/GameObject";

/**
 * Actieresultaat dat inventarisobjecten toont om uit te kiezen
 */
export class ShowInventoryActionResult extends ActionResult {
    /** Lijst van inventarisobjecten om weer te geven */
    private _inventoryItems: GameObject[];

    /**
     * Maak een nieuwe instantie van dit actieresultaat aan
     *
     * @param inventoryItems Lijst van inventarisobjecten om weer te geven
     */
    public constructor(inventoryItems: GameObject[]) {
        super();
        this._inventoryItems = inventoryItems;
    }

    /**
     * Haal de inventarisobjecten op die weergegeven moeten worden
     */
    public get inventoryItems(): GameObject[] {
        return this._inventoryItems;
    }
}

/**
 * Actieresultaat dat mogelijke doelobjecten toont voor een geselecteerd inventarisobject
 */
export class ShowTargetsActionResult extends ActionResult {
    /** Het geselecteerde inventarisobject */
    private _sourceItem: GameObject;

    /** Lijst van mogelijke doelobjecten in de kamer */
    private _targetItems: GameObject[];

    /**
     * Maak een nieuwe instantie van dit actieresultaat aan
     *
     * @param sourceItem Het geselecteerde inventarisobject
     * @param targetItems Lijst van mogelijke doelobjecten in de kamer
     */
    public constructor(sourceItem: GameObject, targetItems: GameObject[]) {
        super();
        this._sourceItem = sourceItem;
        this._targetItems = targetItems;
    }

    /**
     * Haal het geselecteerde inventarisobject op
     */
    public get sourceItem(): GameObject {
        return this._sourceItem;
    }

    /**
     * Haal de mogelijke doelobjecten in de kamer op
     */
    public get targetItems(): GameObject[] {
        return this._targetItems;
    }
}
