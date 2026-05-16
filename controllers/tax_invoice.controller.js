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

const invoiceIncludes = {
    customer: {
        include: {
            addresses: true
        }
    },
    contactPerson: true,
    shippingAddress: true,
    plantUnit: true,
    warehouse: true,
    paymentTerms: true,
    bankAccount: true,
    salesOrder: true,
    lineItems: true
};

const getTaxInvoices = async (req, res, next) => {
    try {
        const taxInvoices = await prisma.taxInvoice.findMany({
            include: invoiceIncludes,
            orderBy: { createdAt: 'desc' }
        });

        sendResponse(res, 200, 200, true, 'Tax invoices fetched successfully!', taxInvoices);
    } catch (error) {
        next(error);
    }
};

const getTaxInvoiceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const taxInvoice = await prisma.taxInvoice.findUnique({
            where: { id: Number(id) },
            include: invoiceIncludes
        });

        if (!taxInvoice) {
            return sendResponse(res, 404, 404, false, 'Tax invoice not found', null);
        }

        sendResponse(res, 200, 200, true, 'Tax invoice fetched successfully!', taxInvoice);
    } catch (error) {
        next(error);
    }
};

const buildInvoiceData = (body, processedLineItems, totals) => {
    const shippingCharge = Number(body.shippingCharge) || 0;
    const tcsAmount = Number(body.tcsAmount) || 0;
    const roundOffEnabled = Boolean(body.roundOffEnabled);

    let subtotal =
        totals.grossAmount +
        totals.cgstAmount +
        totals.sgstAmount +
        totals.igstAmount +
        shippingCharge +
        tcsAmount;

    let roundOff = 0;
    let grandTotal = subtotal;

    if (roundOffEnabled) {
        grandTotal = Math.round(subtotal);
        roundOff = round2(grandTotal - subtotal);
    } else {
        grandTotal = round2(subtotal);
    }

    return {
        supplyType: body.supplyType || null,
        plantUnitId: body.plantUnitId ? Number(body.plantUnitId) : null,
        warehouseId: body.warehouseId ? Number(body.warehouseId) : null,
        customerId: Number(body.customerId),
        contactPersonId: body.contactPersonId ? Number(body.contactPersonId) : null,
        billingAddressText: body.billingAddressText || null,
        gstNo: body.gstNo || null,
        shippingAddressId: body.shippingAddressId ? Number(body.shippingAddressId) : null,
        shippingAddressText: body.shippingAddressText || null,
        invoiceNo: body.invoiceNo,
        invoiceDate: new Date(body.invoiceDate),
        customerPoNo: body.customerPoNo || null,
        customerPoDate: body.customerPoDate ? new Date(body.customerPoDate) : null,
        refSalesOrderId: body.refSalesOrderId ? Number(body.refSalesOrderId) : null,
        salesOrderNo: body.salesOrderNo || null,
        salesOrderDate: body.salesOrderDate ? new Date(body.salesOrderDate) : null,
        despatchDocNo: body.despatchDocNo || null,
        paymentTermId: body.paymentTermId ? Number(body.paymentTermId) : null,
        despatchThrough: body.despatchThrough || null,
        destination: body.destination || null,
        bankAccountId: body.bankAccountId ? Number(body.bankAccountId) : null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        remarks: body.remarks || null,
        ewayBillDetails: body.ewayBillDetails || null,
        termsAndConditions: body.termsAndConditions || null,
        shippingCharge,
        tcsAmount,
        roundOffEnabled,
        roundOff,
        grossAmount: totals.grossAmount,
        cgstAmount: totals.cgstAmount,
        sgstAmount: totals.sgstAmount,
        igstAmount: totals.igstAmount,
        grandTotal,
        lineItems: {
            create: processedLineItems.map((item) => ({
                itemId: Number(item.itemId),
                itemDetails: item.itemDetails || null,
                description: item.description || null,
                customerItemCode: item.customerItemCode || null,
                unitId: item.unitId ? Number(item.unitId) : null,
                hsnCode: item.hsnCode || null,
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
                lineTotal: item.lineTotal,
                refSalesOrderNo: item.refSalesOrderNo || null,
                refJwoinNo: item.refJwoinNo || null,
                refChallanNo: item.refChallanNo || null
            }))
        }
    };
};

const createTaxInvoice = async (req, res, next) => {
    try {
        const { lineItems = [] } = req.body;

        const processedLineItems = lineItems.map((item) => ({
            ...item,
            ...calculateLineItem(item)
        }));

        const totals = calculateTotals(processedLineItems);
        const data = buildInvoiceData(req.body, processedLineItems, totals);

        const taxInvoice = await prisma.taxInvoice.create({
            data,
            include: invoiceIncludes
        });

        await logLineItemsOnCreate(prisma, {
            sourceModule: 'TAX_INVOICE',
            sourceId: taxInvoice.id,
            lineItems: taxInvoice.lineItems
        });

        res.status(201).json({
            success: true,
            message: 'Tax invoice created successfully',
            data: taxInvoice
        });
    } catch (error) {
        next(error);
    }
};

const updateTaxInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lineItems = [] } = req.body;

        const existing = await prisma.taxInvoice.findUnique({
            where: { id: Number(id) },
            include: { lineItems: true }
        });

        if (!existing) {
            return sendResponse(res, 404, 404, false, 'Tax invoice not found', null);
        }

        const processedLineItems = lineItems.map((item) => ({
            ...item,
            ...calculateLineItem(item)
        }));

        const totals = calculateTotals(processedLineItems);
        const data = buildInvoiceData(req.body, processedLineItems, totals);

        await prisma.taxInvoiceLineItem.deleteMany({
            where: { taxInvoiceId: Number(id) }
        });

        await logLineItemsOnUpdate(prisma, {
            sourceModule: 'TAX_INVOICE',
            sourceId: Number(id),
            previousLineItems: existing.lineItems,
            newLineItems: processedLineItems
        });

        const updated = await prisma.taxInvoice.update({
            where: { id: Number(id) },
            data,
            include: invoiceIncludes
        });

        res.status(200).json({
            success: true,
            message: 'Tax invoice updated successfully',
            data: updated
        });
    } catch (error) {
        next(error);
    }
};

const deleteTaxInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.taxInvoice.findUnique({
            where: { id: Number(id) },
            include: { lineItems: true }
        });

        if (!existing) {
            return sendResponse(res, 404, 404, false, 'Tax invoice not found', null);
        }

        await logLineItemsOnDelete(prisma, {
            sourceModule: 'TAX_INVOICE',
            sourceId: existing.id,
            lineItems: existing.lineItems
        });

        await prisma.taxInvoice.delete({
            where: { id: Number(id) }
        });

        sendResponse(res, 200, 200, true, 'Tax invoice deleted successfully!', null);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTaxInvoices,
    getTaxInvoiceById,
    createTaxInvoice,
    updateTaxInvoice,
    deleteTaxInvoice
};
