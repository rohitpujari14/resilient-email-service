"use strict";
// src/index.ts
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
const express_1 = __importDefault(require("express"));
const EmailService_1 = require("./EmailService");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const emailService = new EmailService_1.EmailService();
app.post('/send-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, subject, body, id } = req.body;
    try {
        yield emailService.sendEmail({ to, subject, body, id });
        res.status(200).send('Email sent successfully');
    }
    catch (error) {
        res.status(500).send('Failed to send email: ' + error.message);
    }
}));
app.get('/status/:id', (req, res) => {
    const status = emailService.getStatus(req.params.id);
    if (status) {
        res.status(200).send({ status });
    }
    else {
        res.status(404).send('Email not found');
    }
});
app.listen(3000, () => {
    console.log('Email service running on port 3000');
});
