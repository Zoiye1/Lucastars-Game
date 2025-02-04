import { fileURLToPath } from "url";
import path from "path";
import { defaults, rules } from "@hboictcloud/eslint-plugin";
import { rules as adventureGameRules } from "@hboictcloud/eslint-plugin-adventure-game";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    // Ignores
    {
        ignores: [
            "eslint.config.mjs",
            "**/dist/"
        ],
    },
    // Defaults
    ...defaults,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
            },
        },
    },
    // Rules
    ...rules,
    ...adventureGameRules,
];
