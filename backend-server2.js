const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const cw = require("crypto-wallets");
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
// const fontkit = require('fontkit');

// PDFDocument.registerFontkit(fontkit);
const fs = require('fs');
// const { PDFDocument, rgb } = require('pdf-lib');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


const sentEmails = new Set();


const generateAvalancheAddress = async () => {

   const EVMCompatibleWallet = cw.generateWallet("ETH");
  
   const avalancheAddress = EVMCompatibleWallet.address;
   const avalanchePrivateKey = EVMCompatibleWallet.privateKey;
   

  return {avalancheAddress, avalanchePrivateKey};
};

async function generatePDFWithPrivateKey(privateKey) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  // Use a standard font (Helvetica)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.setFont(helveticaFont);

  page.drawText('Your Private Key:', {
    x: 50,
    y: 300,
    size: 20,
    color: rgb(0, 0, 0), // Black color
  });

  page.drawText(privateKey, {
    x: 50,
    y: 250,
    size: 14,
    color: rgb(0, 0, 0), // Black color
  });

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}


const sendEmail = async (email, avalancheAddress, avalanchePrivateKey) => {
  try {
    const pdfBytes = await generatePDFWithPrivateKey(avalanchePrivateKey); // Generate the PDF

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
      text: `Your new Avalanche address: ${avalancheAddress} , get access to your avalanche wallet : https://wallet.avax.network/access/privatekey , from the private key attached below`,
      attachments: [
        {
          filename: 'privatekey.pdf',
          content: pdfBytes, // Attach the PDF content
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent');
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


  const {avalancheAddress, avalanchePrivateKey} = await generateAvalancheAddress();


  sendEmail(email, avalancheAddress, avalanchePrivateKey);


  sentEmails.add(email);

  res.status(200).send('Avalanche address sent to your email');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});