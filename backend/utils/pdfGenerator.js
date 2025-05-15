import PDFDocument from 'pdfkit';

export const generatePDF = (quotation) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Add Logo
      const logoPath = "images/logo.jpg";
      doc.image(logoPath, 50, 50, { width: 100 });

      // Add Letterhead
      doc.fontSize(20).text("Cosmo Exports Lanka (PVT) LTD", 50, 120, { align: "center" });
      doc.fontSize(12).text("496/1, Naduhena, Meegoda, Sri Lanka", { align: "center" });
      doc.text("Phone: +94 77 086 4011  +94 11 275 2373 | Email: cosmoexportslanka@gmail.com", { align: "center" });
      doc.moveDown(2);

      // Report Title
      doc.fontSize(16).text("Quotation", { align: "center", underline: true });
      doc.moveDown();

      // Customer Information
      const customerInfoTop = 250;
      doc.fontSize(12).text('Customer Details:', 50, customerInfoTop, { underline: true });
      
      doc.fontSize(10)
        .text('Customer Name:', 50, customerInfoTop + 25)
        .text(quotation.customerName || 'N/A', 150, customerInfoTop + 25);
      
      doc.text('Email:', 50, customerInfoTop + 40)
        .text(quotation.customerEmail || 'N/A', 150, customerInfoTop + 40);
      
      doc.text('Vehicle Number:', 50, customerInfoTop + 55)
        .text(quotation.vehicleNumber || 'N/A', 150, customerInfoTop + 55);
      
      // Add date
      doc.text('Date:', 50, customerInfoTop + 70)
        .text(new Date().toLocaleDateString(), 150, customerInfoTop + 70);

      // Calculate subtotal if not provided
      const subtotal = quotation.subtotal || 
        [...(quotation.items || []), ...(quotation.repairs || [])].reduce((sum, item) => {
          const price = Number(item?.price) || 0;
          const quantity = Number(item?.quantity) || 1;
          return sum + (price * quantity);
        }, 0);

      // Items Table
      const itemsTableTop = customerInfoTop + 100;
      
      // Table Header
      doc.fontSize(12).text('Items', 50, itemsTableTop, { underline: true });
      doc.fontSize(10);
      
      // Table column headers
      doc.text('No.', 50, itemsTableTop + 20);
      doc.text('Item Name', 80, itemsTableTop + 20);
      doc.text('Quantity', 250, itemsTableTop + 20, { width: 60, align: 'right' });
      doc.text('Unit Price', 320, itemsTableTop + 20, { width: 80, align: 'right' });
      doc.text('Total', 410, itemsTableTop + 20, { width: 80, align: 'right' });

      // Table rows
      let itemsY = itemsTableTop + 40;
      (quotation.items || []).forEach((item, index) => {
        const price = Number(item?.price) || 0;
        const quantity = Number(item?.quantity) || 0;
        const itemTotal = price * quantity;
        
        doc.text(`${index + 1}.`, 50, itemsY);
        doc.text(item?.itemName || 'N/A', 80, itemsY, { width: 160 });
        doc.text(quantity.toString(), 250, itemsY, { width: 60, align: 'right' });
        doc.text(`LKR ${price.toFixed(2)}`, 320, itemsY, { width: 80, align: 'right' });
        doc.text(`LKR ${itemTotal.toFixed(2)}`, 410, itemsY, { width: 80, align: 'right' });
        
        itemsY += 20;
      });

      // Repairs Table
      const repairsTableTop = itemsY + 20;
      
      // Table Header
      doc.fontSize(12).text('Repairs', 50, repairsTableTop, { underline: true });
      doc.fontSize(10);
      
      // Table column headers
      doc.text('No.', 50, repairsTableTop + 20);
      doc.text('Repair Type', 80, repairsTableTop + 20);
      doc.text('Price', 410, repairsTableTop + 20, { width: 80, align: 'right' });

      // Table rows
      let repairsY = repairsTableTop + 40;
      (quotation.repairs || []).forEach((repair, index) => {
        const price = Number(repair?.price) || 0;
        
        doc.text(`${index + 1}.`, 50, repairsY);
        doc.text(repair?.repairType || 'N/A', 80, repairsY, { width: 320 });
        doc.text(`LKR ${price.toFixed(2)}`, 410, repairsY, { width: 80, align: 'right' });
        
        repairsY += 20;
      });

      // Summary
      const summaryTop = repairsY + 30;
      doc.fontSize(12).text('Summary', 50, summaryTop, { underline: true });
      doc.fontSize(10);
      
      const discount = Number(quotation.discount) || 0;
      const totalAmount = Number(quotation.totalAmount) || (subtotal - discount);
      
      doc.text('Subtotal:', 350, summaryTop + 20, { width: 80, align: 'right' })
        .text(`LKR ${subtotal.toFixed(2)}`, 410, summaryTop + 20, { width: 80, align: 'right' });
      
      doc.text('Discount:', 350, summaryTop + 40, { width: 80, align: 'right' })
        .text(`LKR ${discount.toFixed(2)}`, 410, summaryTop + 40, { width: 80, align: 'right' });
      
      doc.font('Helvetica-Bold')
        .text('Total Amount:', 350, summaryTop + 60, { width: 80, align: 'right' })
        .text(`LKR ${totalAmount.toFixed(2)}`, 410, summaryTop + 60, { width: 80, align: 'right' });
      
      doc.font('Helvetica'); // Reset font

      // Footer
      doc.fontSize(10).text('Thank you for your business!', 50, summaryTop + 100, { align: 'center' });
      doc.text('Terms & Conditions: Payment due within 30 days.', 50, summaryTop + 120, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};