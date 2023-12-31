"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const suggest_schema_1 = require("./suggest.schema");
const Suggest = (0, mongoose_1.model)('Suggest', suggest_schema_1.suggestSchema);
exports.default = Suggest;
