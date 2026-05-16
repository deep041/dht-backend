const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

// controllers/lead.controller.js

const createLead = async (req, res, next) =>
{
    try
    {

        const {
            leadType,
            leadStatus,
            leadSource,
            leadStage,

            name,
            company,
            position,

            gstNo,

            email,
            contactNo,

            website,
            industry,

            countryId,
            stateId,

            city,
            pinCode,

            addressLine1,
            addressLine2,

            regionId,
            zoneId,
            subZoneId,

            assignedEmployeeId,

            items = []
        } = req.body;

        const lead = await prisma.lead.create({
            data: {

                // 🔹 Lead
                leadType: (leadType ? leadType : 'New'),
                leadStatus: (leadStatus ? leadStatus : 'Open'),
                leadSource: (leadSource ? leadSource : 'Other'),
                leadStage: (leadStage ? leadStage : 'Initial Contact'),

                // 🔹 Person
                name,
                company,
                position,

                gstNo,

                email,
                contactNo,

                website,
                industry,

                // 🔹 Address
                countryId: countryId
                    ? Number(countryId)
                    : null,

                stateId: stateId
                    ? Number(stateId)
                    : null,

                city,
                pinCode,

                addressLine1,
                addressLine2,

                // 🔹 Geography
                regionId: regionId
                    ? Number(regionId)
                    : null,

                zoneId: zoneId
                    ? Number(zoneId)
                    : null,

                subZoneId: subZoneId
                    ? Number(subZoneId)
                    : null,

                // 🔹 Employee
                assignedEmployeeId: assignedEmployeeId
                    ? Number(assignedEmployeeId)
                    : null,

                // 🔹 Items
                items: {
                    create: items.map(item => ({
                        itemId: Number(item.itemId),
                        description: item.description,
                        qty: Number(item.qty || 0)
                    }))
                }
            },

            include: {
                items: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Lead created successfully',
            data: lead
        });

    } catch (error)
    {
        next(error);
    }
};

const getLeads = async (req, res, next) =>
{
    try
    {
        const leads = await prisma.lead.findMany({
            include: {
                items: true
            },
            orderBy: {
                id: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            data: leads
        });

    } catch (error)
    {
        next(error);
    }
};

module.exports = { getLeads, createLead };