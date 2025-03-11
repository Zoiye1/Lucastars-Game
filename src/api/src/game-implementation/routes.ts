import { Router } from "express";
import { gameService } from "../global";
import { GameController } from "./controllers/GameController";
import { MoveController } from "./controllers/MoveController";

// Create a router
export const router: Router = Router();

// Instance the controller to handle the requests
const gameController: GameController = new GameController();
const moveController: MoveController = new MoveController();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("Welcome to the Game API!");
});

// NOTE: All endpoints after this line require a player session!
router.use(gameService.createPlayerSessionMiddleware());

router.get("/state", (req, res) => gameController.handleStateRequest(req, res));
router.post("/action", (req, res) => gameController.handleActionRequest(req, res));
router.post("/move", (req, res) => moveController.handleMoveRequest(req, res));
router.put("/retrieve", (req, res) => gameController.handleRetrieveRequest(req, res));
