const { PDFDocument, rgb } = require('pdf-lib');

async function generatePDFWithPrivateKey(privateKey) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a new page to the document
  const page = pdfDoc.addPage([600, 400]);

  // Create a font
  const timesRomanFont = await pdfDoc.embedFont(PDFDocument.StandardFonts.TimesRoman);

  // Set font size and color
  page.drawText('Your Private Key:', {
    x: 50,
    y: 300,
    size: 20,
    font: timesRomanFont,
    color: rgb(0, 0, 0), // Black color
  });

  page.drawText(privateKey, {
    x: 50,
    y: 250,
    size: 14,
    font: timesRomanFont,
    color: rgb(0, 0, 0), // Black color
  });

  // Serialize the PDF document to bytes
  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}

module.exports = generatePDFWithPrivateKey;
