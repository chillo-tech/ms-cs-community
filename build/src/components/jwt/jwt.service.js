"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const private_key_1 = require("./private_key");
const createToken = () => {
    const token = jsonwebtoken_1.default.sign({
        appName: 'SuggestSystem',
    }, private_key_1.privateKey, { expiresIn: '1y' });
    return token;
};
const jwtService = {
    createToken,
};
exports.default = jwtService;
