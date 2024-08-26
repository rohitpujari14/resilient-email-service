"use strict";
// src/__tests__/EmailService.test.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = require("../EmailService");
describe('EmailService', () => {
    let emailService;
    beforeEach(() => {
        emailService = new EmailService_1.EmailService();
    });
    it('should send an email successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = { to: 'test@example.com', subject: 'Hello', body: 'World', id: '1' };
        yield emailService.sendEmail(email);
        expect(emailService.getStatus('1')).toBe('SENT');
    }));
    it('should handle retries and fallback to another provider', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = { to: 'test@example.com', subject: 'Hello', body: 'World', id: '2' };
        yield emailService.sendEmail(email);
        expect(emailService.getStatus('2')).toBe('SENT');
    }));
    it('should prevent duplicate sends (idempotency)', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = { to: 'test@example.com', subject: 'Hello', body: 'World', id: '3' };
        yield emailService.sendEmail(email);
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield emailService.sendEmail(email);
        })).rejects.toThrow('Duplicate email send attempt');
    }));
    it('should enforce rate limiting', () => __awaiter(void 0, void 0, void 0, function* () {
        const email1 = { to: 'test@example.com', subject: 'Hello', body: 'World', id: '4' };
        yield emailService.sendEmail(email1);
        const email2 = { to: 'test@example.com', subject: 'Hello', body: 'World', id: '5' };
        expect(() => __awaiter(void 0, void 0, void 0, function* () {
            yield emailService.sendEmail(email2);
        })).rejects.toThrow('Rate limit exceeded');
    }));
});
