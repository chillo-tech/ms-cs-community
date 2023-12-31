"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const tags_1 = require("../../constants/suggest/tags");
class SuggestZodSchema {
    constructor() {
        this.createSuggestSchema = (0, zod_1.object)({
            body: (0, zod_1.object)({
                author: (0, zod_1.object)({
                    name: (0, zod_1.string)(),
                    email: (0, zod_1.string)().email(),
                    tag: zod_1.ZodEnum.create(tags_1.tags)
                        .array()
                        .min(1, 'you should provide at least one tag')
                        .optional(),
                    phoneIndex: (0, zod_1.number)(),
                    phone: (0, zod_1.number)(),
                    civility: (0, zod_1.string)(),
                }),
                title: (0, zod_1.string)({
                    required_error: 'Title is required',
                    invalid_type_error: 'title should be a string',
                }),
                description: (0, zod_1.string)({
                    invalid_type_error: 'the description should be a string',
                }).optional(),
            }),
        });
    }
}
const suggestZodSchema = new SuggestZodSchema();
exports.default = suggestZodSchema;
