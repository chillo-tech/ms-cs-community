"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestSchema = void 0;
const mongoose_1 = require("mongoose");
exports.suggestSchema = new mongoose_1.Schema({
    author: {
        name: String,
        email: String,
        civility: String,
        tag: [String],
        phoneIndex: Number,
        phone: Number,
    },
    title: String,
    description: String
});
