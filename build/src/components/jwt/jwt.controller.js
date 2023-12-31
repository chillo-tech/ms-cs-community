"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_service_1 = __importDefault(require("./jwt.service"));
const createToken = (req, res) => {
    const token = jwt_service_1.default.createToken();
    res.json({ msg: 'succes', token: `Bearer ${token}` });
};
const jwtController = {
    createToken,
};
exports.default = jwtController;
