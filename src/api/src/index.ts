import "@hboictcloud/metadata";
import "express-async-errors";
import cors from "cors";
import { config } from "dotenv";
import express, { Express } from "express";
import "./global";
import { router } from "./routes";

// Create an Express application
const app: Express = express();

// Load the .env files
config();
config({ path: ".env.local", override: true });

// Enable CORS headers
app.use(cors({
    origin: [
        "https://lucastars-game-web.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    credentials: true,
}));

// Enable JSON-body support for requests
app.use(express.json());

// Forward all requests to the router for further handling
app.use("/", router);

// Start the Express application by listening for connections on the configured port
const port: number = (process.env.PORT || 8080) as number;
app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});
