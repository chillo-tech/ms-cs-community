"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const suggest_model_1 = __importDefault(require("./suggest.model"));
const create = (suggestion) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSuggestion = yield suggest_model_1.default.create(suggestion);
        return newSuggestion.toJSON();
    }
    catch (err) {
        console.log('something went wrong went creating a new suggestion', err);
        throw new Error('something went wrong went creating a new suggestion');
    }
});
const suggestService = {
    create,
};
exports.default = suggestService;
