import { Router } from "express";
import { gameService } from "../global";
import { GameController } from "./controllers/GameController";
import { MoveController } from "./controllers/MoveController";
import { CraftingController } from "./controllers/CraftingController";

// Create a router
export const router: Router = Router();
export const questRouter: Router = Router();

// Instance the controller to handle the requests
const gameController: GameController = new GameController();
const moveController: MoveController = new MoveController();
const craftingController: CraftingController = new CraftingController();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("");
});

// NOTE: All endpoints after this line require a player session!
router.use(gameService.createPlayerSessionMiddleware());

router.get("/state", (req, res) => gameController.handleStateRequest(req, res));
router.post("/action", (req, res) => gameController.handleActionRequest(req, res));
// Maak een nieuwe router voor quests
router.get("/active", (req, res) => gameController.getActiveQuests(req, res));
router.post("/move", (req, res) => moveController.handleMoveRequest(req, res));
router.put("/retrieve", (req, res) => craftingController.handleRetrieveRequest(req, res));
router.delete("/retrieve", (req, res) => craftingController.handleRetrieveRequest(req, res));
