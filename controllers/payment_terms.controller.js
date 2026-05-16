const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getPaymentTerms = async (req, res, next) => {
    const paymentTerms = await prisma.paymentTerms.findMany();
    sendResponse(res, 200, 200, true, 'Payment Terms fetched successfully!', paymentTerms);
}

const createPaymentTerms = async (req, res, next) => {
    const { term_name } = req.body;
    if (!term_name) {
        return sendResponse(res, 400, 400, false, 'Term Name is required!');
    }
    const paymentTerms = await prisma.paymentTerms.create({
        data: {
            term_name
        }
    });
    sendResponse(res, 201, 201, true, 'Payment Terms created successfully!', paymentTerms);
}

module.exports = { getPaymentTerms, createPaymentTerms }