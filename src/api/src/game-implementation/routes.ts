import { Router } from "express";
import { gameService } from "../global";
import { GameController } from "./controllers/GameController";
import { QuestController } from "./controllers/QuestController";

// Create a router
export const router: Router = Router();
export const questRouter: Router = Router();

// Instance the controller to handle the requests
const gameController: GameController = new GameController();
const questController: QuestController = new QuestController();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("");
});

// NOTE: All endpoints after this line require a player session!
router.use(gameService.createPlayerSessionMiddleware());

router.get("/state", (req, res) => gameController.handleStateRequest(req, res));
router.post("/action", (req, res) => gameController.handleActionRequest(req, res));
// Maak een nieuwe router voor quests
questRouter.post("/start", (req, res) => questController.startQuest(req, res));
questRouter.get("/active", (req, res) => questController.getActiveQuest(req, res));
// questRouter.post("/complete", (req, res) => questController.completeQuest(req, res));
router.put("/retrieve", (req, res) => gameController.handleRetrieveRequest(req, res));
