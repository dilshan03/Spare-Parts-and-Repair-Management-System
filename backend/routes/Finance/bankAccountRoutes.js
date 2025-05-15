import express from 'express';
import { 
    createBankAccount, 
    updateBankAccount,
    deleteBankAccount,
    getAllBankAccounts
} from '../../controllers/Finance/bankAccountController.js';

const router = express.Router();

router.post('/create', createBankAccount);
router.get("/", getAllBankAccounts);
router.put("/update/:accountNumber", updateBankAccount);
router.delete("/delete/:accountNumber", deleteBankAccount);

export default router;
