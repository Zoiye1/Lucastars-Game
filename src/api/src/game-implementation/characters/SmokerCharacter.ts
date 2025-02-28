import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Character } from "../../game-base/gameObjects/Character";

/**
 * Class die de karakter "Smoker" representeert.
 *
 * Deze karakter kan met de speler praten en heeft een taak die moet worden voltooid.
 */
export class SmokerCharacter extends Character {
    /** Alias die wordt gebruikt om de smoker te identificeren */
    public static readonly Alias: string = "smoker";

    public constructor() {
        super(SmokerCharacter.Alias);
    }

    /**
     * Geeft de naam van de Smoker terug
     *
     * @returns De naam van de karakter
     */
    public name(): string {
        return "Smoker";
    }

    public talk(_choiceId?: number): ActionResult | undefined {
        return new TextActionResult(["Hello."]);
    }
}
