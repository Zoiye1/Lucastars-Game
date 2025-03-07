import { Router } from "express";
import { gameService } from "../global";
import { GameController } from "./controllers/GameController";

// Create a router
export const router: Router = Router();
export const questRouter: Router = Router();

// Instance the controller to handle the requests
const gameController: GameController = new GameController();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("");
});

// NOTE: All endpoints after this line require a player session!
router.use(gameService.createPlayerSessionMiddleware());

router.get("/state", (req, res) => gameController.handleStateRequest(req, res));
router.post("/action", (req, res) => gameController.handleActionRequest(req, res));
// Maak een nieuwe router voor quests
router.get("/active", (req, res) => gameController.getActiveQuest(req, res));
router.post("/start", (req, res) => gameController.startQuest(req, res));
router.put("/retrieve", (req, res) => gameController.handleRetrieveRequest(req, res));
