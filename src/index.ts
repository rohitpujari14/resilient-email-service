import express from 'express';
import { EmailService } from './EmailService';

const app = express();
app.use(express.json());

const emailService = new EmailService();

app.get('/', (req, res) => {
  res.send('Welcome to the Email Service API');
});

app.post('/send-email', async (req, res) => {
  const { to, subject, body, id } = req.body;
  try {
    await emailService.sendEmail({ to, subject, body, id });
    res.status(200).send('Email sent successfully');
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send('Failed to send email: ' + error.message);
    } else {
      res.status(500).send('Failed to send email due to an unknown error');
    }
  }
});

app.get('/status/:id', (req, res) => {
  const status = emailService.getStatus(req.params.id);
  if (status) {
    res.status(200).send({ status });
  } else {
    res.status(404).send('Email not found');
  }
});

app.listen(3000, () => {
  console.log('Email service running on port 3000');
});
