const fs = require('fs');
const path = require('path');
const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'sales-orders');

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

const saveDocument = (documentBase64, documentFileName) => {
    if (!documentBase64 || !documentFileName) return null;

    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const safeName = path.basename(documentFileName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.join(UPLOAD_DIR, `${Date.now()}_${safeName}`);
    const buffer = Buffer.from(documentBase64, 'base64');
    fs.writeFileSync(filePath, buffer);

    return filePath.replace(/\\/g, '/');
};

const orderIncludes = {
    customer: {
        include: {
            addresses: true
        }
    },
    contactPerson: true,
    shippingAddress: true,
    plantUnit: true,
    paymentTerms: true,
    quotation: true,
    lineItems: true
};

const getSalesOrders = async (req, res, next) => {
    try {
        const salesOrders = await prisma.salesOrder.findMany({
            include: orderIncludes,
            orderBy: { createdAt: 'desc' }
        });

        sendResponse(res, 200, 200, true, 'Sales orders fetched successfully!', salesOrders);
    } catch (error) {
        next(error);
    }
};

const getSalesOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const salesOrder = await prisma.salesOrder.findUnique({
            where: { id: Number(id) },
            include: orderIncludes
        });

        if (!salesOrder) {
            return sendResponse(res, 404, 404, false, 'Sales order not found', null);
        }

        sendResponse(res, 200, 200, true, 'Sales order fetched successfully!', salesOrder);
    } catch (error) {
        next(error);
    }
};

const getSalesOrdersByCustomer = async (req, res, next) => {
    try {
        const { customerId } = req.params;

        const salesOrders = await prisma.salesOrder.findMany({
            where: { customerId: Number(customerId) },
            include: orderIncludes,
            orderBy: { createdAt: 'desc' }
        });

        sendResponse(res, 200, 200, true, 'Sales orders fetched successfully!', salesOrders);
    } catch (error) {
        next(error);
    }
};

const buildOrderData = (body, processedLineItems, totals) => {
    const shippingCharge = Number(body.shippingCharge) || 0;
    const grandTotal =
        totals.grossAmount +
        totals.cgstAmount +
        totals.sgstAmount +
        totals.igstAmount +
        shippingCharge;

    return {
        customerId: Number(body.customerId),
        contactPersonId: body.contactPersonId ? Number(body.contactPersonId) : null,
        shippingAddressId: body.shippingAddressId ? Number(body.shippingAddressId) : null,
        shippingAddressText: body.shippingAddressText || null,
        gstNo: body.gstNo || null,
        plantUnitId: body.plantUnitId ? Number(body.plantUnitId) : null,
        orderDate: new Date(body.orderDate),
        poNo: body.poNo || null,
        poDate: body.poDate ? new Date(body.poDate) : null,
        refQuotationId: body.refQuotationId ? Number(body.refQuotationId) : null,
        paymentTermId: body.paymentTermId ? Number(body.paymentTermId) : null,
        termsAndConditions: body.termsAndConditions || null,
        shippingCharge,
        grossAmount: totals.grossAmount,
        cgstAmount: totals.cgstAmount,
        sgstAmount: totals.sgstAmount,
        igstAmount: totals.igstAmount,
        grandTotal: round2(grandTotal),
        lineItems: {
            create: processedLineItems.map((item) => ({
                itemId: Number(item.itemId),
                itemDetails: item.itemDetails || null,
                description: item.description || null,
                poLineNo: item.poLineNo || null,
                unitId: item.unitId ? Number(item.unitId) : null,
                hsnCode: item.hsnCode || null,
                deliveryDate: item.deliveryDate ? new Date(item.deliveryDate) : null,
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

const createSalesOrder = async (req, res, next) => {
    try {
        const { lineItems = [], documentBase64, documentFileName } = req.body;

        const processedLineItems = lineItems.map((item) => ({
            ...item,
            ...calculateLineItem(item)
        }));

        const totals = calculateTotals(processedLineItems);
        const data = buildOrderData(req.body, processedLineItems, totals);
        data.clientPoDocument = saveDocument(documentBase64, documentFileName);

        const salesOrder = await prisma.salesOrder.create({
            data,
            include: orderIncludes
        });

        res.status(201).json({
            success: true,
            message: 'Sales order created successfully',
            data: salesOrder
        });
    } catch (error) {
        next(error);
    }
};

const updateSalesOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lineItems = [], documentBase64, documentFileName, removeDocument } = req.body;

        const existing = await prisma.salesOrder.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return sendResponse(res, 404, 404, false, 'Sales order not found', null);
        }

        const processedLineItems = lineItems.map((item) => ({
            ...item,
            ...calculateLineItem(item)
        }));

        const totals = calculateTotals(processedLineItems);
        const data = buildOrderData(req.body, processedLineItems, totals);

        if (documentBase64 && documentFileName) {
            data.clientPoDocument = saveDocument(documentBase64, documentFileName);
        } else if (removeDocument) {
            data.clientPoDocument = null;
        }

        await prisma.salesOrderLineItem.deleteMany({
            where: { salesOrderId: Number(id) }
        });

        const updated = await prisma.salesOrder.update({
            where: { id: Number(id) },
            data,
            include: orderIncludes
        });

        res.status(200).json({
            success: true,
            message: 'Sales order updated successfully',
            data: updated
        });
    } catch (error) {
        next(error);
    }
};

const deleteSalesOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.salesOrder.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return sendResponse(res, 404, 404, false, 'Sales order not found', null);
        }

        await prisma.salesOrder.delete({
            where: { id: Number(id) }
        });

        sendResponse(res, 200, 200, true, 'Sales order deleted successfully!', null);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSalesOrders,
    getSalesOrderById,
    getSalesOrdersByCustomer,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder
};
