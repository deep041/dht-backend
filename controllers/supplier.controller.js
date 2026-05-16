const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getSuppliers = async (req, res, next) => {
    const suppliers = await prisma.supplier.findMany();
    sendResponse(res, 200, 200, true, 'Suppliers fetched successfully!', suppliers);
}

const createSupplier = async (req, res, next) =>
{
    try
    {
        const {
            partyGroupId,
            companyName,
            legalName,
            gstNo,
            panNo,
            typeOfConcern,
            gstRegistrationType,
            vendorCode,
            contactNo,
            email,
            addressLine1,
            place,
            pinCode,
            countryId,
            stateId,
            stateCode,
            website,
            creditPeriodDays,
            creditLimit,
            paymentTermId,
            note,
            openingAmount,
            balanceType,
            contactPersons = [],
            bankAccounts = []
        } = req.body;

        const supplier = await prisma.supplier.create({
            data: {
                partyGroupId,
                companyName,
                legalName,
                gstNo,
                panNo,
                typeOfConcern,
                gstRegistrationType,
                vendorCode,
                contactNo,
                email,
                addressLine1,
                place,
                pinCode,
                countryId,
                stateId,
                stateCode,
                website,
                creditPeriodDays: creditPeriodDays ? Number(creditPeriodDays) : null,
                creditLimit: creditLimit ? Number(creditLimit) : null,
                paymentTermId,
                note,
                openingAmount: openingAmount ? Number(openingAmount) : null,
                balanceType,

                // 👇 Nested create
                contactPersons: {
                    create: contactPersons.map(cp => ({
                        name: cp.name,
                        mobileNo: cp.mobileNo,
                        email: cp.email,
                        designation: cp.designation
                    }))
                },

                bankAccounts: {
                    create: bankAccounts.map(ba => ({
                        bankName: ba.bankName,
                        accountNo: ba.accountNo,
                        accountType: ba.accountType,
                        branchCode: ba.branchCode,
                        branchName: ba.branchName,
                        branchAddress: ba.branchAddress,
                        ifscCode: ba.ifscCode,
                        swiftCode: ba.swiftCode
                    }))
                }
            },
            include: {
                contactPersons: true,
                bankAccounts: true
            }
        });

        sendResponse(res, 201, 201, true, 'Supplier created successfully!', supplier);

    } catch (error)
    {
        next(error);
    }
};

module.exports = { getSuppliers, createSupplier }