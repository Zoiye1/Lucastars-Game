import { Request, Response } from "express";
import { GameController } from "./GameController";
import { ExecuteMoveRequest, GameState } from "@shared/types";
import { gameService } from "../../global";

export class MoveController extends GameController {
    public async handleMoveRequest(req: Request, res: Response): Promise<void> {
        const { alias } = req.body as ExecuteMoveRequest;

        gameService.getPlayerSession().currentRoom = alias;

        const gameState: GameState | undefined = await this.executeAction("move", [alias]);
        if (gameState) {
            res.json(gameState);
        }
        else {
            res.status(500).json({ error: "Movement failed" });
        }
    }
}
