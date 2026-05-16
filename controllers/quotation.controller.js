const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

// Calculate totals from line items
const calculateTotals = (lineItems) => {
    let grossAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    lineItems.forEach(item => {
        grossAmount += item.lineTotal || 0;
        cgstAmount += item.cgstAmount || 0;
        sgstAmount += item.sgstAmount || 0;
    });

    return { grossAmount, cgstAmount, sgstAmount, igstAmount };
};

// Calculate line item totals
const calculateLineItem = (item) => {
    const qty = item.qty || 0;
    const rate = item.rate || 0;
    const discountPercentage = item.discountPercentage || 0;

    // Calculate base amount
    let baseAmount = qty * rate;

    // Calculate discount
    let discountAmount = (baseAmount * discountPercentage) / 100;
    let taxableAmount = baseAmount - discountAmount;

    // Calculate CGST & SGST
    let cgstRate = item.cgstRate || 0;
    let sgstRate = item.sgstRate || 0;

    let cgstAmount = (taxableAmount * cgstRate) / 100;
    let sgstAmount = (taxableAmount * sgstRate) / 100;

    let lineTotal = taxableAmount + cgstAmount + sgstAmount;

    return {
        discountAmount: Math.round(discountAmount * 100) / 100,
        taxableAmount: Math.round(taxableAmount * 100) / 100,
        cgstAmount: Math.round(cgstAmount * 100) / 100,
        sgstAmount: Math.round(sgstAmount * 100) / 100,
        lineTotal: Math.round(lineTotal * 100) / 100
    };
};

// Get all quotations
const getQuotations = async (req, res, next) => {
    try {
        const quotations = await prisma.quotation.findMany({
            include: {
                customer: true,
                contactPerson: true,
                paymentTerms: true,
                bankAccount: true,
                lineItems: {
                    include: {
                        quotation: false
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        sendResponse(res, 200, 200, true, 'Quotations fetched successfully!', quotations);
    } catch (error) {
        next(error);
    }
};

// Get single quotation
const getQuotationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const quotation = await prisma.quotation.findUnique({
            where: { id: Number(id) },
            include: {
                customer: {
                    include: {
                        addresses: true,
                        contactPersons: true
                    }
                },
                contactPerson: true,
                paymentTerms: true,
                bankAccount: true,
                lineItems: true
            }
        });

        if (!quotation) {
            return sendResponse(res, 404, 404, false, 'Quotation not found', null);
        }

        sendResponse(res, 200, 200, true, 'Quotation fetched successfully!', quotation);
    } catch (error) {
        next(error);
    }
};

// Create quotation
const createQuotation = async (req, res, next) => {
    try {
        const {
            customerId,
            contactPersonId,
            gstNo,
            quoteDate,
            expiryDate,
            paymentTermId,
            bankAccountId,
            quoteType,
            lineItems = [],
            termsAndConditions,
            shippingCharge = 0
        } = req.body;

        // Process line items with calculations
        const processedLineItems = lineItems.map(item => {
            const calculations = calculateLineItem(item);
            return {
                ...item,
                ...calculations
            };
        });

        // Calculate totals
        const totals = calculateTotals(processedLineItems);
        const grandTotal = totals.grossAmount + totals.cgstAmount + totals.sgstAmount + Number(shippingCharge);

        // Create quotation
        const quotation = await prisma.quotation.create({
            data: {
                customerId: Number(customerId),
                contactPersonId: contactPersonId ? Number(contactPersonId) : null,
                gstNo: gstNo || null,
                quoteDate: new Date(quoteDate),
                expiryDate: new Date(expiryDate),
                paymentTermId: paymentTermId ? Number(paymentTermId) : null,
                bankAccountId: bankAccountId ? Number(bankAccountId) : null,
                quoteType: quoteType,
                termsAndConditions: termsAndConditions || null,
                shippingCharge: Number(shippingCharge),
                grossAmount: totals.grossAmount,
                cgstAmount: totals.cgstAmount,
                sgstAmount: totals.sgstAmount,
                igstAmount: totals.igstAmount,
                grandTotal: grandTotal,

                // Create line items
                lineItems: {
                    create: processedLineItems.map(item => ({
                        itemId: Number(item.itemId),
                        description: item.description || null,
                        unitId: item.unitId ? Number(item.unitId) : null,
                        hsnCode: item.hsnCode || null,
                        qty: Number(item.qty),
                        rate: Number(item.rate),
                        discountPercentage: Number(item.discountPercentage),
                        discountAmount: item.discountAmount,
                        taxableAmount: item.taxableAmount,
                        cgstRate: Number(item.cgstRate),
                        cgstAmount: item.cgstAmount,
                        sgstRate: Number(item.sgstRate),
                        sgstAmount: item.sgstAmount,
                        lineTotal: item.lineTotal
                    }))
                }
            },
            include: {
                customer: true,
                contactPerson: true,
                paymentTerms: true,
                bankAccount: true,
                lineItems: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Quotation created successfully',
            data: quotation
        });
    } catch (error) {
        next(error);
    }
};

// Update quotation
const updateQuotation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            contactPersonId,
            gstNo,
            quoteDate,
            expiryDate,
            paymentTermId,
            bankAccountId,
            quoteType,
            lineItems = [],
            termsAndConditions,
            shippingCharge = 0
        } = req.body;

        // Get existing quotation
        const existingQuotation = await prisma.quotation.findUnique({
            where: { id: Number(id) },
            include: { lineItems: true }
        });

        if (!existingQuotation) {
            return sendResponse(res, 404, 404, false, 'Quotation not found', null);
        }

        // Process line items with calculations
        const processedLineItems = lineItems.map(item => {
            const calculations = calculateLineItem(item);
            return {
                ...item,
                ...calculations
            };
        });

        // Calculate totals
        const totals = calculateTotals(processedLineItems);
        const grandTotal = totals.grossAmount + totals.cgstAmount + totals.sgstAmount + Number(shippingCharge);

        // Delete existing line items
        await prisma.quotationLineItem.deleteMany({
            where: { quotationId: Number(id) }
        });

        // Update quotation
        const updatedQuotation = await prisma.quotation.update({
            where: { id: Number(id) },
            data: {
                contactPersonId: contactPersonId ? Number(contactPersonId) : null,
                gstNo: gstNo || null,
                quoteDate: new Date(quoteDate),
                expiryDate: new Date(expiryDate),
                paymentTermId: paymentTermId ? Number(paymentTermId) : null,
                bankAccountId: bankAccountId ? Number(bankAccountId) : null,
                quoteType: quoteType,
                termsAndConditions: termsAndConditions || null,
                shippingCharge: Number(shippingCharge),
                grossAmount: totals.grossAmount,
                cgstAmount: totals.cgstAmount,
                sgstAmount: totals.sgstAmount,
                igstAmount: totals.igstAmount,
                grandTotal: grandTotal,

                // Create line items
                lineItems: {
                    create: processedLineItems.map(item => ({
                        itemId: Number(item.itemId),
                        description: item.description || null,
                        unitId: item.unitId ? Number(item.unitId) : null,
                        hsnCode: item.hsnCode || null,
                        qty: Number(item.qty),
                        rate: Number(item.rate),
                        discountPercentage: Number(item.discountPercentage),
                        discountAmount: item.discountAmount,
                        taxableAmount: item.taxableAmount,
                        cgstRate: Number(item.cgstRate),
                        cgstAmount: item.cgstAmount,
                        sgstRate: Number(item.sgstRate),
                        sgstAmount: item.sgstAmount,
                        lineTotal: item.lineTotal
                    }))
                }
            },
            include: {
                customer: true,
                contactPerson: true,
                paymentTerms: true,
                bankAccount: true,
                lineItems: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Quotation updated successfully',
            data: updatedQuotation
        });
    } catch (error) {
        next(error);
    }
};

// Delete quotation
const deleteQuotation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const quotation = await prisma.quotation.findUnique({
            where: { id: Number(id) }
        });

        if (!quotation) {
            return sendResponse(res, 404, 404, false, 'Quotation not found', null);
        }

        await prisma.quotation.delete({
            where: { id: Number(id) }
        });

        sendResponse(res, 200, 200, true, 'Quotation deleted successfully!', null);
    } catch (error) {
        next(error);
    }
};

// Get quotations by customer
const getQuotationsByCustomer = async (req, res, next) => {
    try {
        const { customerId } = req.params;

        const quotations = await prisma.quotation.findMany({
            where: { customerId: Number(customerId) },
            include: {
                customer: true,
                contactPerson: true,
                paymentTerms: true,
                bankAccount: true,
                lineItems: true
            },
            orderBy: { createdAt: 'desc' }
        });

        sendResponse(res, 200, 200, true, 'Quotations fetched successfully!', quotations);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getQuotations,
    getQuotationById,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    getQuotationsByCustomer
};
