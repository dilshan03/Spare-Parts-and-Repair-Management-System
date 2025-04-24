const nodemailer = require('nodemailer');
const { generatePDF } = require('./pdfGenerator'); // Import the PDF generator

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the email service
  auth: {
    user: process.env.EMAIL, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail password or app-specific password
  },
});

// Function to send an email with the quotation PDF
const sendQuotationEmail = async (quotation) => {
  try {
    // Generate the PDF
    const pdfBuffer = await generatePDF(quotation);

    // Email options
    const mailOptions = {
      from: process.env.EMAIL, // Sender address
      to: quotation.customerEmail, // Recipient address
      subject: 'Your Quotation', // Email subject
      text: 'Please find your quotation attached. Please send us a reply stating whether you accept or reject the quotation', // Email body
      attachments: [
        {
          filename: 'quotation.pdf', // Name of the attachment
          content: pdfBuffer, // PDF buffer
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};

module.exports = { sendQuotationEmail };