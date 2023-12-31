"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requestValidation_1 = __importDefault(require("../../middlewares/requestValidation"));
const suggest_zod_1 = __importDefault(require("./suggest.zod"));
const jwt_1 = require("../../middlewares/jwt");
const suggest_controller_1 = __importDefault(require("./suggest.controller"));
const router = (0, express_1.Router)();
router.use(jwt_1.authToken);
// create new suggestion
router
    .route('/')
    .post((0, requestValidation_1.default)(suggest_zod_1.default.createSuggestSchema), suggest_controller_1.default.makeSuggestion);
exports.default = router;
