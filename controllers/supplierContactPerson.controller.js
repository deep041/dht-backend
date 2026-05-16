const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

/**
 * GET /suppliers/:supplierId/contact-persons
 * Returns contact persons for a supplier from SupplierContactPerson table.
 */
const getContactPersonsBySupplierId = async (req, res, next) => {
    try {
        const supplierId = Number(req.params.supplierId);

        if (!supplierId || Number.isNaN(supplierId)) {
            return sendResponse(res, 400, 400, false, 'Valid supplier ID is required', null);
        }

        const supplier = await prisma.supplier.findUnique({
            where: { id: supplierId }
        });

        if (!supplier) {
            return sendResponse(res, 404, 404, false, 'Supplier not found', null);
        }

        const contactPersons = await prisma.supplierContactPerson.findMany({
            where: { supplierId },
            orderBy: { name: 'asc' }
        });

        sendResponse(res, 200, 200, true, 'Contact persons fetched successfully!', contactPersons);
    } catch (error) {
        next(error);
    }
};

module.exports = { getContactPersonsBySupplierId };
