import PDFDocument from 'pdfkit';  // Use import instead of require

export const generatePDF = (quotation) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    // Add Logo
    const logoPath = "images/logo.jpg"; // Adjust the path based on your project structure
    doc.image(logoPath, 50, 50, { width: 100 });

    // Add Letterhead
    doc.fontSize(20).text("Cosmo Exports Lanka (PVT) LTD", 50, 120, { align: "center" });
    doc.fontSize(12).text("496/1, Naduhena, Meegoda, Sri Lanka", { align: "center" });
    doc.text("Phone: +94 77 086 4011  +94 11 275 2373 | Email: cosmoexportslanka@gmail.com", { align: "center" });
    doc.moveDown(2);

    // Report Title
    doc.fontSize(16).text("Quotation", { align: "center", underline: true });
    doc.moveDown(2);

    // Add content to the PDF
    doc.fontSize(14).text(`Customer: ${quotation.customerName}`);
    doc.text(`Email: ${quotation.customerEmail}`);
    doc.text(`Vehicle Number: ${quotation.vehicleNumber}`);
    doc.text('Items:');
    quotation.items.forEach((item) => {
      doc.text(`${item.itemName} - ${item.quantity} x LKR ${item.price}`);
    });
    doc.text('Repairs:');
    quotation.repairs.forEach((repair) => {
      doc.text(`${repair.repairType} - LKR ${repair.price}`);
    });
    doc.text(`Discount: LKR ${quotation.discount}`);
    doc.text(`Total Amount: LKR ${quotation.totalAmount}`);
    doc.end();
  });
};
