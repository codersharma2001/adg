const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const cw = require("crypto-wallets");
const crypto = require('crypto');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const fontkit =  require('@pdf-lib/fontkit');


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const sentEmails = new Set();

const generateAvalancheAddress = async () => {
  const EVMCompatibleWallet = cw.generateWallet("ETH");
  const avalancheAddress = EVMCompatibleWallet.address;
  const avalanchePrivateKey = EVMCompatibleWallet.privateKey;
  return { avalancheAddress, avalanchePrivateKey };
};

async function generatePDFWithPrivateKey(privateKey) {
  PDFDocument.registerFontkit(fontkit);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  // Load your custom font file
  const fontData = fs.readFileSync('D:/Avalanche-Address-Generator/avalanche-address-app/rubik/Rubik-Regular.ttf');
  const customFont = await pdfDoc.embedFont(fontData);

  page.setFont(customFont);

  page.drawText('Your Private Key:', {
    x: 50,
    y: 300,
    size: 20,
    color: rgb(0, 0, 0),
  });

  page.drawText(privateKey, {
    x: 50,
    y: 250,
    size: 14,
    color: rgb(0, 0, 0),
  });

  // Generate a random password for encryption
  const password = crypto.randomBytes(16).toString('hex');

  // Encrypt the PDF with a password
  const encryptedPdfBytes = await pdfDoc.save({
    password: password, // Add the password property
    permissions: {
      print: true,
      copy: true,
    },
  });

  return { encryptedPdfBytes, password };
}


const sendEmail = async (email, avalancheAddress, encryptedPdfBytes, password) => {
  try {
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
      text: `Your new Avalanche address: ${avalancheAddress}`,
      attachments: [
        {
          filename: 'privatekey.pdf',
          content: encryptedPdfBytes,
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent');

    // Send the password securely (e.g., through a different communication channel)
    console.log('Password for PDF encryption:', password);
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

app.post('/generate-avalanche-address', async (req, res) => {
  const { email } = req.body;

  if (sentEmails.has(email)) {
    res.status(400).send('Email already sent');
    return;
  }

  const { avalanchePrivateKey } = await generateAvalancheAddress();
  const { encryptedPdfBytes, password } = await generatePDFWithPrivateKey(avalanchePrivateKey);
  sendEmail(email, avalancheAddress, encryptedPdfBytes, password);

  sentEmails.add(email);

  res.status(200).send('Avalanche address sent to your email');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
