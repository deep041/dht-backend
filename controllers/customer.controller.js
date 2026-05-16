const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getCustomers = async (req, res, next) => {
    try {
        const customer = await prisma.customer.findMany({
            include: {
                addresses: true
            },
            orderBy: { companyName: 'asc' }
        });
        sendResponse(res, 200, 200, true, 'Customer fetched successfully!', customer);
    } catch (error) {
        next(error);
    }
};

const createCustomer = async (req, res, next) =>
{
    try
    {
        const {
            basic,
            billing,
            shipping,
            finance,
            contactPersons = []
        } = req.body;

        const customer = await prisma.customer.create({
            data: {
                supplyType: basic.supplyType,
                partyGroupId: Number(basic.partyGroupId),
                companyName: basic.companyName,
                legalName: basic.legalName,
                panNo: basic.panNo,
                contactNo: basic.contactNo,
                email: basic.email,

                vendorCode: finance.vendorCode,
                creditPeriodDays: Number(finance.creditPeriodDays),
                creditLimit: Number(finance.creditLimit),
                paymentTermId: Number(finance.paymentTermId),
                note: finance.note,

                // 🔥 Addresses
                addresses: {
                    create: [
                        {
                            type: 'BILLING',
                            attentionName: billing.attentionName,
                            gstNo: billing.gstNo,
                            addressLine: billing.addressLine,
                            place: billing.place,
                            pinCode: billing.pinCode,
                            countryId: Number(billing.countryId),
                            stateId: Number(billing.stateId),
                            stateCode: billing.stateCode
                        },
                        {
                            type: 'SHIPPING',
                            attentionName: shipping.attentionName,
                            gstNo: shipping.gstNo,
                            addressLine: shipping.addressLine,
                            place: shipping.place,
                            pinCode: shipping.pinCode,
                            countryId: Number(shipping.countryId),
                            stateId: Number(shipping.stateId),
                            stateCode: shipping.stateCode
                        }
                    ]
                },

                // 🔥 Contacts
                contactPersons: {
                    create: contactPersons.map(c => ({
                        name: c.name,
                        mobileNo: c.mobileNo,
                        email: c.email,
                        designation: c.designation
                    }))
                }
            },
            include: {
                addresses: true,
                contactPersons: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            data: customer
        });

    } catch (error)
    {
        next(error);
    }
};

module.exports = { getCustomers, createCustomer };