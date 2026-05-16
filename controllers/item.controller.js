const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');
const { logItemMasterOnCreate } = require('../utils/item_transaction');

// controllers/item.controller.js

const createItem = async (req, res, next) =>
{
    try
    {

        const {
            classificationId,
            categoryId,
            groupId,
            subGroupId,

            itemName,
            description,
            grade,
            partDescription,

            unitId,

            purchaseRate,
            sellingRate,

            hsnId,
            gstSlab,

            drawingNo,
            drawingRevision,
            customerItemCode,

            allowedExcessQty,
            thickness,
            length,
            width,

            netWeight,
            grossWeight,

            weightUomId,
            density,
            densityUomId,

            surfaceArea,
            surfaceAreaUomId,

            rawMaterialItemId,
            scrapItemId,

            leadTimeDays,
            minStockQty,
            minOrderQty,

            valuationMethod,

            allowNegativeStock,
            inspectionRequired,

            isDimensional,
            isScrap,

            itemType
        } = req.body;

        const item = await prisma.item.create({
            data: {

                classificationId: Number(classificationId),
                categoryId: Number(categoryId),
                groupId: Number(groupId),
                subGroupId: subGroupId ? Number(subGroupId) : null,

                itemName,
                description,
                grade,
                partDescription,

                unitId: Number(unitId),

                purchaseRate: Number(purchaseRate || 0),
                sellingRate: Number(sellingRate || 0),

                hsnId: Number(hsnId),
                gstSlab: Number(gstSlab),

                drawingNo,
                drawingRevision,
                customerItemCode,

                allowedExcessQty: Number(allowedExcessQty || 0),

                thickness: Number(thickness || 0),
                length: Number(length || 0),
                width: Number(width || 0),

                netWeight: Number(netWeight || 0),
                grossWeight: Number(grossWeight || 0),

                weightUomId: weightUomId ? Number(weightUomId) : null,

                density: Number(density || 0),
                densityUomId: densityUomId ? Number(densityUomId) : null,

                surfaceArea: Number(surfaceArea || 0),
                surfaceAreaUomId: surfaceAreaUomId
                    ? Number(surfaceAreaUomId)
                    : null,

                rawMaterialItemId: rawMaterialItemId
                    ? Number(rawMaterialItemId)
                    : null,

                scrapItemId: scrapItemId
                    ? Number(scrapItemId)
                    : null,

                leadTimeDays: Number(leadTimeDays || 0),

                minStockQty: Number(minStockQty || 0),
                minOrderQty: Number(minOrderQty || 0),

                valuationMethod,

                allowNegativeStock: Boolean(allowNegativeStock),
                inspectionRequired: Boolean(inspectionRequired),

                isDimensional: Boolean(isDimensional),
                isScrap: Boolean(isScrap),

                itemType
            }
        });

        await logItemMasterOnCreate(prisma, item);

        sendResponse(res, 201, 201, true, 'Item created successfully!', item);

    } catch (error)
    {
        next(error);
    }
};

const getItems = async (req, res, next) =>
{
    try
    {
        const items = await prisma.item.findMany({
            include: {

            }
        });

        sendResponse(res, 200, 200, true, 'Items retrieved successfully!', items);
    } catch (error)
    {
        next(error);
    }
};

module.exports = { getItems, createItem };