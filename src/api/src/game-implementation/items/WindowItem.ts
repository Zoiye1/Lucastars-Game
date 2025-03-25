import { ActionResult } from "../../game-base/actionResults/ActionResult";
import { TextActionResult } from "../../game-base/actionResults/TextActionResult";
import { Examine } from "../../game-base/actions/ExamineAction";
import { PlayerSession } from "../types";
import { gameService } from "../../global";
import { GameObject, GameObjectType } from "../../game-base/gameObjects/GameObject";
import { TargetItem } from "../../game-base/gameObjects/TargetItem";

type BreakableItemAlias = "PaintingItem" | "HammerItem";
type MessagesByItem = Record<BreakableItemAlias, string[]>;

export class WindowItem extends TargetItem implements Examine {
    public static readonly Alias = "WindowItem";

    public constructor() {
        super(WindowItem.Alias);
    }

    public name(): string {
        return "Window";
    }

    public type(): GameObjectType[] {
        return ["actionableItem"];
    }

    public examine(): ActionResult {
        return new TextActionResult(["A window leading to the hallway. It's locked."]);
    }

    public useWith(sourceItem: GameObject): ActionResult | undefined {
        const playerSession: PlayerSession = gameService.getPlayerSession();
        const windowBreakingItems: BreakableItemAlias[] = ["PaintingItem", "HammerItem"];

        // Handle the fork case separately, before checking breaking items
        if (sourceItem.alias === "ForkItem") {
            return new TextActionResult([
                "You stab the fork against the window! nothing happens...",
                "What were you thinking?",
            ]);
        }

        // Check if using a breaking item on the window
        if (windowBreakingItems.includes(sourceItem.alias as BreakableItemAlias)) {
            playerSession.windowBroken = true;
            // Remove the item from inventory since it's been used
            const inventory = playerSession.inventory;
            const index = inventory.indexOf(sourceItem.alias);
            if (index !== -1) {
                inventory.splice(index, 1);
            }

            const messages: MessagesByItem = {
                PaintingItem: [
                    "You throw the painting at the window, shattering it!",
                    "You can now enter the hallway.",
                ],
                HammerItem: [
                    "You bash the hammer against the window, smashing it completely!",
                    "You can now enter the hallway.",
                ],
            };

            const itemAlias = sourceItem.alias as BreakableItemAlias;
            const messageForItem = messages[itemAlias];

            return new TextActionResult(
                messageForItem || [
                    `You use the ${sourceItem.alias} to break the window!`, // Fixed backticks here
                    "You can now enter the hallway.",
                ]
            );
        }

        return undefined;
    }
}
