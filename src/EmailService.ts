// src/EmailService.ts

type EmailStatus = 'PENDING' | 'SENT' | 'FAILED';

interface Email {
  to: string;
  subject: string;
  body: string;
  id: string;
}

interface Provider {
  sendEmail(email: Email): Promise<boolean>;
}

class MockProviderA implements Provider {
  async sendEmail(email: Email): Promise<boolean> {
    // Simulate a success or failure
    return Math.random() > 0.3;
  }
}

class MockProviderB implements Provider {
  async sendEmail(email: Email): Promise<boolean> {
    // Simulate a success or failure
    return Math.random() > 0.3;
  }
}

export class EmailService {
  private providers: Provider[] = [];
  private statusMap: Map<string, EmailStatus> = new Map();
  private lastRequestTimestamp: number = 0;
  private rateLimit: number = 1000; // 1 request per second

  constructor() {
    this.providers.push(new MockProviderA(), new MockProviderB());
  }

  async sendEmail(email: Email) {
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
          success = await provider.sendEmail(email);
          if (success) break;
        } catch (error) {
          console.error('Error sending email:', error);
        }
        retries++;
        await this.exponentialBackoff(retries);
      }

      if (success) {
        this.statusMap.set(email.id, 'SENT');
        return;
      }
    }

    this.statusMap.set(email.id, 'FAILED');
  }

  private async exponentialBackoff(retries: number) {
    const delay = Math.pow(2, retries) * 100;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  getStatus(emailId: string): EmailStatus | undefined {
    return this.statusMap.get(emailId);
  }
}
