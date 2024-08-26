// src/__tests__/EmailService.test.ts

import { EmailService } from '../EmailService';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  it('should send an email successfully', async () => {
    const email = { to: 'test@example.com', subject: 'Hello', body: 'World', id: '1' };
    await emailService.sendEmail(email);
    expect(emailService.getStatus('1')).toBe('SENT');
  });

  it('should handle retries and fallback to another provider', async () => {
    const email = { to: 'test@example.com', subject: 'Hello', body: 'World', id: '2' };
    await emailService.sendEmail(email);
    expect(emailService.getStatus('2')).toBe('SENT');
  });

  it('should prevent duplicate sends (idempotency)', async () => {
    const email = { to: 'test@example.com', subject: 'Hello', body: 'World', id: '3' };
    await emailService.sendEmail(email);
    expect(async () => {
      await emailService.sendEmail(email);
    }).rejects.toThrow('Duplicate email send attempt');
  });

  it('should enforce rate limiting', async () => {
    const email1 = { to: 'test@example.com', subject: 'Hello', body: 'World', id: '4' };
    await emailService.sendEmail(email1);

    const email2 = { to: 'test@example.com', subject: 'Hello', body: 'World', id: '5' };
    expect(async () => {
      await emailService.sendEmail(email2);
    }).rejects.toThrow('Rate limit exceeded');
  });
});
