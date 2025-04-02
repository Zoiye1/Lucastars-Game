import { Router } from "express";
import { gameService } from "../global";
import { GameController } from "./controllers/GameController";
import { InventoryController } from "./controllers/InventoryController";
import { MoveController } from "./controllers/MoveController";
import { CraftingController } from "./controllers/CraftingController";
import { HintController } from "./controllers/HintController";

// Create a router
export const router: Router = Router();
export const questRouter: Router = Router();

// Instance the controller to handle the requests
const gameController: GameController = new GameController();
const inventoryController: InventoryController = new InventoryController();
const moveController: MoveController = new MoveController();
const craftingController: CraftingController = new CraftingController();
const hintController: HintController = new HintController();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("");
});

// NOTE: All endpoints after this line require a player session!
router.use(gameService.createPlayerSessionMiddleware());

router.get("/state", (req, res) => gameController.handleStateRequest(req, res));
router.post("/action", (req, res) => gameController.handleActionRequest(req, res));
router.get("/hint", (req, res) => hintController.handlePlayerSessionRequest(req, res));
// Maak een nieuwe router voor quests
router.get("/active", (req, res) => gameController.getActiveQuests(req, res));
router.get("/inventory", (req, res) => inventoryController.handleGetInventoryRequest(req, res));
router.get("/inventoryItem", (req, res) => inventoryController.handleGetInventoryItemRequest(req, res));
router.put("/inventory", (req, res) => inventoryController.handleSelectedItemInventory(req, res));
router.post("/move", (req, res) => moveController.handleMoveRequest(req, res));
router.put("/retrieve", (req, res) => craftingController.handleRetrieveRequest(req, res));
router.delete("/retrieve", (req, res) => craftingController.handleDeleteItemsRequest(req, res));
