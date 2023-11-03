const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Create a Set to store email addresses for which an email has been sent
const sentEmails = new Set();

// Generate a unique Avalanche address
const generateAvalancheAddress = () => {
  // Generate a random 32-byte hexadecimal address
  return 'AVAX-' + crypto.randomBytes(16).toString('hex');
};

// Send an email with the generated Avalanche address
const sendEmail = (email, address) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'madhav04042001@gmail.com',
      pass: 'zrxolpzvrutipoov',
    },
  });

  const mailOptions = {
    from: 'madhav04042001@gmail.com',
    to: email,
    subject: 'Your New Avalanche Address',
    text: `Your new Avalanche address: ${address}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Handle address generation and email sending
app.post('/generate-avalanche-address', (req, res) => {
  const { email } = req.body;

  // Check if the email has already been sent
  if (sentEmails.has(email)) {
    res.status(400).send('Email already sent');
    return;
  }

  // Generate a random Avalanche address
  const avalancheAddress = generateAvalancheAddress();

  // Send the generated address to the specified email
  sendEmail(email, avalancheAddress);

  // Add the email to the set to track that it has been sent
  sentEmails.add(email);

  res.status(200).send('Avalanche address sent to your email');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
