// controllers/reportController.js
import Sale from "../../Inventory/models/Sale.js";

export const getMonthlySalesReport = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(1); // First day of the month
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1, 0); // Last day of the month

        const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } }).populate("product");

        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

        res.status(200).json({ sales, totalRevenue });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

