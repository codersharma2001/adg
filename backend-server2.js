const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


const sentEmails = new Set();


const generateAvalancheAddress = async () => {

  const apiKey = 'ac_eW_T6YnstSp3ubjr211ua2bgBDkO26S0KbhAlBbuZsuWq9giFX4bs8EsZhHZiXs11C6RrRN7f17ZpSkSJn4MJg';


  const response = await axios.post('https://api.avax.network/v2/wallets/create', {
    apiKey,
  });


  const avalancheAddress = response.data.address;

  return avalancheAddress;
};


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

app.post('/generate-avalanche-address', async (req, res) => {
  const { email } = req.body;


  if (sentEmails.has(email)) {
    res.status(400).send('Email already sent');
    return;
  }


  const avalancheAddress = await generateAvalancheAddress();


  sendEmail(email, avalancheAddress);


  sentEmails.add(email);

  res.status(200).send('Avalanche address sent to your email');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});