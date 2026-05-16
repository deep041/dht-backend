const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

/**
 * GET /customers/:customerId/contact-persons
 * Returns contact persons for a customer from CustomerContactPerson table.
 */
const getContactPersonsByCustomerId = async (req, res, next) => {
    try {
        const customerId = Number(req.params.customerId);

        if (!customerId || Number.isNaN(customerId)) {
            return sendResponse(res, 400, 400, false, 'Valid customer ID is required', null);
        }

        const customer = await prisma.customer.findUnique({
            where: { id: customerId }
        });

        if (!customer) {
            return sendResponse(res, 404, 404, false, 'Customer not found', null);
        }

        const contactPersons = await prisma.customerContactPerson.findMany({
            where: { customerId },
            orderBy: { name: 'asc' }
        });

        sendResponse(res, 200, 200, true, 'Contact persons fetched successfully!', contactPersons);
    } catch (error) {
        next(error);
    }
};

module.exports = { getContactPersonsByCustomerId };
