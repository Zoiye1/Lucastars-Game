import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { Item } from "../../game-base/gameObjects/Item";
import { GameObject } from "../../game-base/gameObjects/GameObject";

/**
 * Interface voor objecten die doelen kunnen zijn van inventarisobjecten
 */
@Interface
export abstract class TargetOf {
    /**
     * Voer de actie uit van het gebruiken van een ander object op dit doel
     *
     * @param sourceItem Het object dat op dit doel wordt gebruikt
     * @returns Resultaat van de actie of undefined als het niet wordt afgehandeld
     */
    public abstract useWith(sourceItem: GameObject): ActionResult | undefined;
}

/**
 * Basisklasse voor objecten die doelen kunnen zijn van andere objecten
 */
export abstract class TargetItem extends Item implements TargetOf {
    /**
     * Maak een nieuwe instantie van dit doelobject aan
     *
     * @param alias Alias van dit doelobject
     */
    protected constructor(alias: string) {
        super(alias);
    }

    /**
     * Verwerk het gebruik van een inventarisobject op dit doelobject
     *
     * @param sourceItem Het object dat op dit doel wordt gebruikt
     * @returns Resultaat van de actie of undefined als het niet wordt afgehandeld
     */
    public abstract useWith(sourceItem: GameObject): ActionResult | undefined;
}
