"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = require("nodemailer");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.transporter = (0, nodemailer_1.createTransport)({
    service: 'gmail',
    auth: {
        user: 'brightkyefoo@gmail.com',
        pass: process.env.GMAIL_PWD,
    },
});
