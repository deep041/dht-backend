const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const includeRelations = {
    department: true,
    salesOrder: {
        include: {
            customer: true
        }
    },
    plantUnit: true,
    lineItems: {
        include: {
            suggestedVendor: true
        }
    }
};

const getPurchaseIndents = async (req, res, next) => {
    try {
        const indents = await prisma.purchaseIndent.findMany({
            include: includeRelations,
            orderBy: { createdAt: 'desc' }
        });

        sendResponse(res, 200, 200, true, 'Purchase indents fetched successfully!', indents);
    } catch (error) {
        next(error);
    }
};

const getPurchaseIndentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const indent = await prisma.purchaseIndent.findUnique({
            where: { id: Number(id) },
            include: includeRelations
        });

        if (!indent) {
            return sendResponse(res, 404, 404, false, 'Purchase indent not found', null);
        }

        sendResponse(res, 200, 200, true, 'Purchase indent fetched successfully!', indent);
    } catch (error) {
        next(error);
    }
};

const createPurchaseIndent = async (req, res, next) => {
    try {
        const {
            prApprovalPath,
            departmentId,
            refSalesOrderId,
            refProdPlnNo,
            indentDate,
            plantUnitId,
            typeOfPr,
            docAttachmentRequired,
            remarks,
            lineItems = []
        } = req.body;

        const indent = await prisma.purchaseIndent.create({
            data: {
                prApprovalPath: prApprovalPath || 'Default Path For Indent',
                departmentId: departmentId ? Number(departmentId) : null,
                refSalesOrderId: refSalesOrderId ? Number(refSalesOrderId) : null,
                refProdPlnNo: refProdPlnNo || null,
                indentDate: new Date(indentDate),
                plantUnitId: plantUnitId ? Number(plantUnitId) : null,
                typeOfPr: typeOfPr || null,
                docAttachmentRequired: Boolean(docAttachmentRequired),
                remarks: remarks || null,
                lineItems: {
                    create: lineItems.map(item => ({
                        itemId: item.itemId ? Number(item.itemId) : null,
                        description: item.description || null,
                        qty: Number(item.qty) || 0,
                        unitId: item.unitId ? Number(item.unitId) : null,
                        requiredDate: item.requiredDate ? new Date(item.requiredDate) : null,
                        suggestedVendorId: item.suggestedVendorId ? Number(item.suggestedVendorId) : null,
                        details: item.details || null
                    }))
                }
            },
            include: includeRelations
        });

        res.status(201).json({
            success: true,
            message: 'Purchase indent created successfully',
            data: indent
        });
    } catch (error) {
        next(error);
    }
};

const updatePurchaseIndent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            prApprovalPath,
            departmentId,
            refSalesOrderId,
            refProdPlnNo,
            indentDate,
            plantUnitId,
            typeOfPr,
            docAttachmentRequired,
            remarks,
            lineItems = []
        } = req.body;

        const existing = await prisma.purchaseIndent.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return sendResponse(res, 404, 404, false, 'Purchase indent not found', null);
        }

        await prisma.purchaseIndentLineItem.deleteMany({
            where: { purchaseIndentId: Number(id) }
        });

        const indent = await prisma.purchaseIndent.update({
            where: { id: Number(id) },
            data: {
                prApprovalPath: prApprovalPath || 'Default Path For Indent',
                departmentId: departmentId ? Number(departmentId) : null,
                refSalesOrderId: refSalesOrderId ? Number(refSalesOrderId) : null,
                refProdPlnNo: refProdPlnNo || null,
                indentDate: new Date(indentDate),
                plantUnitId: plantUnitId ? Number(plantUnitId) : null,
                typeOfPr: typeOfPr || null,
                docAttachmentRequired: Boolean(docAttachmentRequired),
                remarks: remarks || null,
                lineItems: {
                    create: lineItems.map(item => ({
                        itemId: item.itemId ? Number(item.itemId) : null,
                        description: item.description || null,
                        qty: Number(item.qty) || 0,
                        unitId: item.unitId ? Number(item.unitId) : null,
                        requiredDate: item.requiredDate ? new Date(item.requiredDate) : null,
                        suggestedVendorId: item.suggestedVendorId ? Number(item.suggestedVendorId) : null,
                        details: item.details || null
                    }))
                }
            },
            include: includeRelations
        });

        res.status(200).json({
            success: true,
            message: 'Purchase indent updated successfully',
            data: indent
        });
    } catch (error) {
        next(error);
    }
};

const deletePurchaseIndent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.purchaseIndent.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return sendResponse(res, 404, 404, false, 'Purchase indent not found', null);
        }

        await prisma.purchaseIndent.delete({
            where: { id: Number(id) }
        });

        sendResponse(res, 200, 200, true, 'Purchase indent deleted successfully!', null);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPurchaseIndents,
    getPurchaseIndentById,
    createPurchaseIndent,
    updatePurchaseIndent,
    deletePurchaseIndent
};
