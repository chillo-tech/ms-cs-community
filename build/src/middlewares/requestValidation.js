"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = (schema) => (req, res, next) => {
    try {
        console.log('req.body', req.body);
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        return res.status(400).json({
            message: 'something went wront on validation',
            error,
        });
    }
};
exports.default = validate;
