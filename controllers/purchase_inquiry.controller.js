const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');
const {
    logLineItemsOnCreate,
    logLineItemsOnUpdate,
    logLineItemsOnDelete
} = require('../utils/item_transaction');

const includeRelations = {
    salesOrder: {
        include: {
            customer: true
        }
    },
    plantUnit: true,
    purchaseIndent: true,
    supplier: true,
    lineItems: true
};

const getPurchaseInquiries = async (req, res, next) => {
    try {
        const inquiries = await prisma.purchaseInquiry.findMany({
            include: includeRelations,
            orderBy: { createdAt: 'desc' }
        });

        sendResponse(res, 200, 200, true, 'Purchase inquiries fetched successfully!', inquiries);
    } catch (error) {
        next(error);
    }
};

const getPurchaseInquiryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const inquiry = await prisma.purchaseInquiry.findUnique({
            where: { id: Number(id) },
            include: includeRelations
        });

        if (!inquiry) {
            return sendResponse(res, 404, 404, false, 'Purchase inquiry not found', null);
        }

        sendResponse(res, 200, 200, true, 'Purchase inquiry fetched successfully!', inquiry);
    } catch (error) {
        next(error);
    }
};

const createPurchaseInquiry = async (req, res, next) => {
    try {
        const {
            approvalPath,
            refSalesOrderId,
            refProductionNo,
            supplierId,
            enquiryDate,
            requiredDeliveryDate,
            validTillDate,
            plantUnitId,
            refPurchaseIndentId,
            docAttachmentRequired,
            remarks,
            lineItems = []
        } = req.body;

        const inquiry = await prisma.purchaseInquiry.create({
            data: {
                approvalPath: approvalPath || 'Default Path For Purchase Enquiry',
                refSalesOrderId: refSalesOrderId ? Number(refSalesOrderId) : null,
                refProductionNo: refProductionNo || null,
                supplierId: supplierId ? Number(supplierId) : null,
                enquiryDate: new Date(enquiryDate),
                requiredDeliveryDate: requiredDeliveryDate ? new Date(requiredDeliveryDate) : null,
                validTillDate: validTillDate ? new Date(validTillDate) : null,
                plantUnitId: plantUnitId ? Number(plantUnitId) : null,
                refPurchaseIndentId: refPurchaseIndentId ? Number(refPurchaseIndentId) : null,
                docAttachmentRequired: Boolean(docAttachmentRequired),
                remarks: remarks || null,
                lineItems: {
                    create: lineItems.map(item => ({
                        itemId: item.itemId ? Number(item.itemId) : null,
                        description: item.description || null,
                        qty: Number(item.qty) || 0,
                        unitId: item.unitId ? Number(item.unitId) : null,
                        hsnCode: item.hsnCode || null
                    }))
                }
            },
            include: includeRelations
        });

        await logLineItemsOnCreate(prisma, {
            sourceModule: 'PURCHASE_INQUIRY',
            sourceId: inquiry.id,
            lineItems: inquiry.lineItems
        });

        res.status(201).json({
            success: true,
            message: 'Purchase inquiry created successfully',
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

const updatePurchaseInquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            approvalPath,
            refSalesOrderId,
            refProductionNo,
            supplierId,
            enquiryDate,
            requiredDeliveryDate,
            validTillDate,
            plantUnitId,
            refPurchaseIndentId,
            docAttachmentRequired,
            remarks,
            lineItems = []
        } = req.body;

        const existing = await prisma.purchaseInquiry.findUnique({
            where: { id: Number(id) },
            include: { lineItems: true }
        });

        if (!existing) {
            return sendResponse(res, 404, 404, false, 'Purchase inquiry not found', null);
        }

        await prisma.purchaseInquiryLineItem.deleteMany({
            where: { purchaseInquiryId: Number(id) }
        });

        await logLineItemsOnUpdate(prisma, {
            sourceModule: 'PURCHASE_INQUIRY',
            sourceId: Number(id),
            previousLineItems: existing.lineItems,
            newLineItems: lineItems
        });

        const inquiry = await prisma.purchaseInquiry.update({
            where: { id: Number(id) },
            data: {
                approvalPath: approvalPath || 'Default Path For Purchase Enquiry',
                refSalesOrderId: refSalesOrderId ? Number(refSalesOrderId) : null,
                refProductionNo: refProductionNo || null,
                supplierId: supplierId ? Number(supplierId) : null,
                enquiryDate: new Date(enquiryDate),
                requiredDeliveryDate: requiredDeliveryDate ? new Date(requiredDeliveryDate) : null,
                validTillDate: validTillDate ? new Date(validTillDate) : null,
                plantUnitId: plantUnitId ? Number(plantUnitId) : null,
                refPurchaseIndentId: refPurchaseIndentId ? Number(refPurchaseIndentId) : null,
                docAttachmentRequired: Boolean(docAttachmentRequired),
                remarks: remarks || null,
                lineItems: {
                    create: lineItems.map(item => ({
                        itemId: item.itemId ? Number(item.itemId) : null,
                        description: item.description || null,
                        qty: Number(item.qty) || 0,
                        unitId: item.unitId ? Number(item.unitId) : null,
                        hsnCode: item.hsnCode || null
                    }))
                }
            },
            include: includeRelations
        });

        res.status(200).json({
            success: true,
            message: 'Purchase inquiry updated successfully',
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

const deletePurchaseInquiry = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.purchaseInquiry.findUnique({
            where: { id: Number(id) },
            include: { lineItems: true }
        });

        if (!existing) {
            return sendResponse(res, 404, 404, false, 'Purchase inquiry not found', null);
        }

        await logLineItemsOnDelete(prisma, {
            sourceModule: 'PURCHASE_INQUIRY',
            sourceId: existing.id,
            lineItems: existing.lineItems
        });

        await prisma.purchaseInquiry.delete({
            where: { id: Number(id) }
        });

        sendResponse(res, 200, 200, true, 'Purchase inquiry deleted successfully!', null);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPurchaseInquiries,
    getPurchaseInquiryById,
    createPurchaseInquiry,
    updatePurchaseInquiry,
    deletePurchaseInquiry
};
