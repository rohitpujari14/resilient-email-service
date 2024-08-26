# Resilient Email Service

## Overview
This project implements a resilient email sending service in TypeScript. The service is designed to be fault-tolerant with features such as a retry mechanism, fallback between providers, idempotency, rate limiting, and status tracking.

## Features
- **Retry Mechanism**: Automatically retries failed email sends with exponential backoff.
- **Fallback Providers**: Switches to a secondary email provider if the primary one fails.
- **Idempotency**: Ensures that duplicate emails are not sent.
- **Rate Limiting**: Prevents excessive email sending within a short period.
- **Status Tracking**: Tracks and reports the status of each email send attempt.

## Project Structure

```plaintext
resilient-email-service/
├── src/
│   ├── EmailService.ts      # Core email service logic
│   ├── index.ts             # Express server setup
│   └── __tests__/
│       └── EmailService.test.ts  # Unit tests for EmailService
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
Prerequisites
Node.js and npm installed
AWS CLI installed and configured
AWS Elastic Beanstalk CLI (EB CLI) installed
Installation and Setup
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/resilient-email-service.git
cd resilient-email-service
Install dependencies:

bash
Copy code
npm install
Compile TypeScript:

bash
Copy code
npx tsc
Run the service locally:

bash
Copy code
npx ts-node src/index.ts
API Endpoints
POST /send-email
Description: Send an email.
Request Body:
json
Copy code
{
  "to": "recipient@example.com",
  "subject": "Subject",
  "body": "Email body",
  "id": "unique-email-id"
}
Response:
200: Email sent successfully.
500: Failed to send email with an error message.
GET /status/:id
Description: Get the status of an email send attempt.
Response:
200: Returns the status (PENDING, SENT, or FAILED).
404: Email not found.
Running Tests
Run unit tests:
bash
Copy code
npx jest
Deployment to AWS Elastic Beanstalk
Step 1: Initialize Elastic Beanstalk
Initialize Elastic Beanstalk:
bash
Copy code
eb init
Choose your region (e.g., us-west-2).
Select the application name (e.g., resilient-email-service).
Choose the platform (Node.js).
Step 2: Create an Elastic Beanstalk Environment
Create an environment and deploy:
bash
Copy code
eb create resilient-email-service-env
Elastic Beanstalk will automatically set up the environment and deploy the application.
Step 3: Deploy Updates
Deploy changes:
bash
Copy code
eb deploy
Step 4: Access the Deployed API
Check the status:
bash
Copy code
eb status
Access the deployed API:
The API will be accessible at http://<your-environment-url>.elasticbeanstalk.com.
Additional Notes
Rate Limiting: The service is rate-limited to 1 request per second. Ensure your API requests respect this limit.
Idempotency: Ensure that each email id is unique to avoid duplicate sends.
