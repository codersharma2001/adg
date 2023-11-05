const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const { spawnSync } = require('child_process');

async function createPDF(outputPDFPath) {
  // Create a new PDF document using pdf-lib
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();
  const helveticaFont = await pdfDoc.embedFont('Helvetica');

  const drawTextOptions = {
    font: helveticaFont,
    size: 30,
    color: rgb(0, 0, 0),
  };

  page.drawText('Hello, World!', {
    x: 50,
    y: height - 50,
    ...drawTextOptions,
  });

  // Serialize the PDF document to bytes
  const pdfBytes = await pdfDoc.save();

  // Write the PDF to the output file
  fs.writeFileSync(outputPDFPath, pdfBytes);
}

function encryptPDFWithPassword(inputPDFPath, outputPDFPath, password) {
  // Use node-qpdf to encrypt the PDF with a password
  const qpdfProcess = spawnSync('qpdf', [
    '--encrypt', password, password, '128', '--', inputPDFPath, outputPDFPath,
  ]);

  if (qpdfProcess.error) {
    console.error('Error:', qpdfProcess.error.message);
  } else {
    console.log(`PDF encrypted with password and saved to ${outputPDFPath}`);
  }
}

const inputPDFPath = 'D:/Avalanche-Address-Generator/avalanche-address-app/privatekey.pdf';
const outputPDFPath = 'D:/Avalanche-Address-Generator/avalanche-address-app/privatekey.pdf';
const password = '123456';

createPDF(inputPDFPath)
  .then(() => {
    encryptPDFWithPassword(inputPDFPath, outputPDFPath, password);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
