"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const config_1 = require("./app/config");
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://ssh-hall-management.netlify.app"],
    credentials: true,
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
// router setup
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send(`Server Running on port ${config_1.envVars.PORT}`);
});
// global error handler middleware
app.use(globalErrorHandler_1.default);
// not found middleware
app.use(notFound_1.default);
exports.default = app;
