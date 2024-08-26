"use strict";
// src/EmailService.ts
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
exports.EmailService = void 0;
class MockProviderA {
    sendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Simulate a success or failure
            return Math.random() > 0.3;
        });
    }
}
class MockProviderB {
    sendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Simulate a success or failure
            return Math.random() > 0.3;
        });
    }
}
class EmailService {
    constructor() {
        this.providers = [];
        this.statusMap = new Map();
        this.lastRequestTimestamp = 0;
        this.rateLimit = 1000; // 1 request per second
        this.providers.push(new MockProviderA(), new MockProviderB());
    }
    sendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.statusMap.has(email.id)) {
                throw new Error('Duplicate email send attempt');
            }
            if (Date.now() - this.lastRequestTimestamp < this.rateLimit) {
                throw new Error('Rate limit exceeded');
            }
            this.statusMap.set(email.id, 'PENDING');
            this.lastRequestTimestamp = Date.now();
            for (let i = 0; i < this.providers.length; i++) {
                const provider = this.providers[i];
                let success = false;
                let retries = 0;
                while (retries < 5) {
                    try {
                        success = yield provider.sendEmail(email);
                        if (success)
                            break;
                    }
                    catch (error) {
                        console.error('Error sending email:', error);
                    }
                    retries++;
                    yield this.exponentialBackoff(retries);
                }
                if (success) {
                    this.statusMap.set(email.id, 'SENT');
                    return;
                }
            }
            this.statusMap.set(email.id, 'FAILED');
        });
    }
    exponentialBackoff(retries) {
        return __awaiter(this, void 0, void 0, function* () {
            const delay = Math.pow(2, retries) * 100;
            return new Promise((resolve) => setTimeout(resolve, delay));
        });
    }
    getStatus(emailId) {
        return this.statusMap.get(emailId);
    }
}
exports.EmailService = EmailService;
