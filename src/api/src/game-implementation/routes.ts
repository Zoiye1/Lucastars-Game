import { Router } from "express";
import { gameService } from "../global";
import { GameController } from "./controllers/GameController";
import { CraftingController } from "./controllers/CraftingController";

// Create a router
export const router: Router = Router();

// Instance the controller to handle the requests
const gameController: GameController = new GameController();
const craftingController: CraftingController = new CraftingController();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("Welcome to the Game API!");
});

// NOTE: All endpoints after this line require a player session!
router.use(gameService.createPlayerSessionMiddleware());

router.get("/state", (req, res) => gameController.handleStateRequest(req, res));
router.post("/action", (req, res) => gameController.handleActionRequest(req, res));
router.put("/retrieve", (req, res) => craftingController.handleRetrieveRequest(req, res));
router.delete("/retrieve", (req, res) => craftingController.handleRetrieveRequest(req, res));
