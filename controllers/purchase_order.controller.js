const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');
const {
    logLineItemsOnCreate,
    logLineItemsOnUpdate,
    logLineItemsOnDelete
} = require('../utils/item_transaction');

const round2 = (n) => Math.round((n || 0) * 100) / 100;

const calculateLineItem = (item) => {
    const qty = item.qty || 0;
    const rate = item.rate || 0;
    const discountPercentage = item.discountPercentage || 0;
    const cgstRate = item.cgstRate || 0;
    const sgstRate = item.sgstRate || 0;
    const igstRate = item.igstRate || 0;

    const baseAmount = qty * rate;
    const discountAmount = (baseAmount * discountPercentage) / 100;
    const taxableAmount = baseAmount - discountAmount;

    const cgstAmount = (taxableAmount * cgstRate) / 100;
    const sgstAmount = (taxableAmount * sgstRate) / 100;
    const igstAmount = (taxableAmount * igstRate) / 100;
    const lineTotal = taxableAmount + cgstAmount + sgstAmount + igstAmount;

    return {
        discountAmount: round2(discountAmount),
        taxableAmount: round2(taxableAmount),
        cgstAmount: round2(cgstAmount),
        sgstAmount: round2(sgstAmount),
        igstAmount: round2(igstAmount),
        lineTotal: round2(lineTotal)
    };
};

const calculateTotals = (lineItems) => {
    let grossAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    lineItems.forEach((item) => {
        grossAmount += item.taxableAmount || 0;
        cgstAmount += item.cgstAmount || 0;
        sgstAmount += item.sgstAmount || 0;
        igstAmount += item.igstAmount || 0;
    });

    return {
        grossAmount: round2(grossAmount),
        cgstAmount: round2(cgstAmount),
        sgstAmount: round2(sgstAmount),
        igstAmount: round2(igstAmount)
    };
};

const includeRelations = {
    supplier: true,
    contactPerson: true,
    salesOrder: {
        include: {
            customer: true
        }
    },
    plantUnit: true,
    paymentTerms: true,
    purchaseIndent: true,
    lineItems: true
};

const buildOrderData = (body, processedLineItems, totals) => {
    const shippingCharge = Number(body.shippingCharge) || 0;
    let subtotal =
        totals.grossAmount +
        totals.cgstAmount +
        totals.sgstAmount +
        totals.igstAmount +
        shippingCharge;

    let roundOff = 0;
    let grandTotal = subtotal;

    if (body.roundOffEnabled) {
        grandTotal = Math.round(subtotal);
        roundOff = round2(grandTotal - subtotal);
    } else {
        grandTotal = round2(subtotal);
    }

    return {
        poType: body.poType || 'PO ADMINISTRATION',
        supplierId: body.supplierId ? Number(body.supplierId) : null,
        contactPersonId: body.contactPersonId ? Number(body.contactPersonId) : null,
        gstNo: body.gstNo || null,
        supplierBranch: body.supplierBranch || null,
        orderDate: new Date(body.orderDate),
        refSuppQuoteNo: body.refSuppQuoteNo || null,
        suppQuoteDate: body.suppQuoteDate ? new Date(body.suppQuoteDate) : null,
        refSalesOrderId: body.refSalesOrderId ? Number(body.refSalesOrderId) : null,
        refProductionNo: body.refProductionNo || null,
        plantUnitId: body.plantUnitId ? Number(body.plantUnitId) : null,
        shipToAddress: body.shipToAddress || null,
        paymentTermId: body.paymentTermId ? Number(body.paymentTermId) : null,
        currency: body.currency || 'INR',
        fcnrValue: body.fcnrValue != null ? Number(body.fcnrValue) : 1,
        refPurchaseIndentId: body.refPurchaseIndentId ? Number(body.refPurchaseIndentId) : null,
        docAttachmentRequired: Boolean(body.docAttachmentRequired),
        remarks: body.remarks || null,
        termsAndConditions: body.termsAndConditions || null,
        shippingCharge,
        roundOff,
        roundOffEnabled: Boolean(body.roundOffEnabled),
        grossAmount: totals.grossAmount,
        cgstAmount: totals.cgstAmount,
        sgstAmount: totals.sgstAmount,
        igstAmount: totals.igstAmount,
        grandTotal,
        lineItems: {
            create: processedLineItems.map((item) => ({
                itemId: item.itemId ? Number(item.itemId) : null,
                description: item.description || null,
                unitId: item.unitId ? Number(item.unitId) : null,
                hsnCode: item.hsnCode || null,
                requiredBy: item.requiredBy ? new Date(item.requiredBy) : null,
                committedDate: item.committedDate ? new Date(item.committedDate) : null,
                qty: Number(item.qty),
                rate: Number(item.rate),
                discountPercentage: Number(item.discountPercentage) || 0,
                discountAmount: item.discountAmount,
                taxableAmount: item.taxableAmount,
                cgstRate: Number(item.cgstRate) || 0,
                cgstAmount: item.cgstAmount,
                sgstRate: Number(item.sgstRate) || 0,
                sgstAmount: item.sgstAmount,
                igstRate: Number(item.igstRate) || 0,
                igstAmount: item.igstAmount,
                lineTotal: item.lineTotal
            }))
        }
    };
};

const getPurchaseOrders = async (req, res, next) => {
    try {
        const orders = await prisma.purchaseOrder.findMany({
            include: includeRelations,
            orderBy: { createdAt: 'desc' }
        });

        sendResponse(res, 200, 200, true, 'Purchase orders fetched successfully!', orders);
    } catch (error) {
        next(error);
    }
};

const getPurchaseOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await prisma.purchaseOrder.findUnique({
            where: { id: Number(id) },
            include: includeRelations
        });

        if (!order) {
            return sendResponse(res, 404, 404, false, 'Purchase order not found', null);
        }

        sendResponse(res, 200, 200, true, 'Purchase order fetched successfully!', order);
    } catch (error) {
        next(error);
    }
};

const createPurchaseOrder = async (req, res, next) => {
    try {
        const { lineItems = [] } = req.body;

        const processedLineItems = lineItems.map((item) => ({
            ...item,
            ...calculateLineItem(item)
        }));

        const totals = calculateTotals(processedLineItems);
        const data = buildOrderData(req.body, processedLineItems, totals);

        const order = await prisma.purchaseOrder.create({
            data,
            include: includeRelations
        });

        await logLineItemsOnCreate(prisma, {
            sourceModule: 'PURCHASE_ORDER',
            sourceId: order.id,
            lineItems: order.lineItems
        });

        res.status(201).json({
            success: true,
            message: 'Purchase order created successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

const updatePurchaseOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lineItems = [] } = req.body;

        const existing = await prisma.purchaseOrder.findUnique({
            where: { id: Number(id) },
            include: { lineItems: true }
        });

        if (!existing) {
            return sendResponse(res, 404, 404, false, 'Purchase order not found', null);
        }

        const processedLineItems = lineItems.map((item) => ({
            ...item,
            ...calculateLineItem(item)
        }));

        const totals = calculateTotals(processedLineItems);
        const data = buildOrderData(req.body, processedLineItems, totals);

        await prisma.purchaseOrderLineItem.deleteMany({
            where: { purchaseOrderId: Number(id) }
        });

        await logLineItemsOnUpdate(prisma, {
            sourceModule: 'PURCHASE_ORDER',
            sourceId: Number(id),
            previousLineItems: existing.lineItems,
            newLineItems: processedLineItems
        });

        const order = await prisma.purchaseOrder.update({
            where: { id: Number(id) },
            data,
            include: includeRelations
        });

        res.status(200).json({
            success: true,
            message: 'Purchase order updated successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

const deletePurchaseOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.purchaseOrder.findUnique({
            where: { id: Number(id) },
            include: { lineItems: true }
        });

        if (!existing) {
            return sendResponse(res, 404, 404, false, 'Purchase order not found', null);
        }

        await logLineItemsOnDelete(prisma, {
            sourceModule: 'PURCHASE_ORDER',
            sourceId: existing.id,
            lineItems: existing.lineItems
        });

        await prisma.purchaseOrder.delete({
            where: { id: Number(id) }
        });

        sendResponse(res, 200, 200, true, 'Purchase order deleted successfully!', null);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPurchaseOrders,
    getPurchaseOrderById,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder
};
