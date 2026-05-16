const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getBankAccounts = async (req, res, next) => {
    const bankAccounts = await prisma.bankAccounts.findMany();
    sendResponse(res, 200, 200, true, 'Bank Accounts fetched successfully!', bankAccounts);
}

const createBankAccounts = async (req, res, next) => {
    const { account_number, bank_name, ifsc_code, branch_name, branch_code, micr_code, bank_address, account_name, details, opening_balance, credit_or_debit } = req.body;
    if (!account_number) {
        return sendResponse(res, 400, 400, false, 'Account Number is required!');
    }
    const bankAccounts = await prisma.bankAccounts.create({
        data: {
            account_number, bank_name, ifsc_code, branch_name, branch_code, micr_code, bank_address, account_name, details, opening_balance, credit_or_debit
        }
    });
    sendResponse(res, 201, 201, true, 'Bank Accounts created successfully!', bankAccounts);
}

module.exports = { getBankAccounts, createBankAccounts }