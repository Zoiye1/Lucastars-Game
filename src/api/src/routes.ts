import { Router } from "express";
import { router as gameRouter } from "./game-implementation/routes";
// import { router as questRouter } from "./game-implementation/routes";
// Create a router
export const router: Router = Router();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("Welcome to the API!");
});

// Forward endpoints to other routers
router.use("/game", gameRouter);
// router.use("/quest", questRouter);
