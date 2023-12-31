"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const private_key_1 = require("../components/jwt/private_key");
const authToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        const message = "veillez generer un jeton d'authentification.";
        return res.status(401).json({ message });
    }
    const token = authorizationHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, private_key_1.privateKey, (error, decodedtoken) => {
        if (error) {
            const message = "l'utilisateur n'est pas autorisé à acceder à la ressouce.";
            return res.status(401).json({ message });
        }
        if (decodedtoken.appName !== 'SuggestSystem') {
            return res.status(401).json({ message: 'non autorise' });
        }
        next();
    });
};
exports.authToken = authToken;
