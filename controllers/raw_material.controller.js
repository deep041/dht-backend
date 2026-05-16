const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getRawMaterial = async (req, res, next) => {
    const rawMaterial = await prisma.rawMaterial.findMany();
    sendResponse(res, 200, 200, true, 'Raw Material fetched successfully!', rawMaterial);
}

const createRawMaterial = async (req, res, next) =>
{
    try
    {
        const data = req.body;

        const item = await prisma.rawMaterial.create({
            data: {
                shapeId: Number(data.shapeId),
                materialId: Number(data.materialId),
                itemName: data.itemName,
                description: data.description,
                grade: data.grade,
                unitId: Number(data.unitId),

                purchaseRate: Number(data.purchaseRate),
                sellingRate: Number(data.sellingRate),

                hsnId: Number(data.hsnId),
                gstSlab: Number(data.gstSlab),

                type: data.type,
                scrapItemId: data.scrapItemId ? Number(data.scrapItemId) : null,

                allowedExcessQty: Number(data.allowedExcessQty || 0),
                thickness: Number(data.thickness || 0),
                leadTimeDays: Number(data.leadTimeDays || 0),
                minStockQty: Number(data.minStockQty || 0),
                minOrderQty: Number(data.minOrderQty || 0),

                valuationMethod: data.valuationMethod,

                isDimensional: data.isDimensional,
                isScrap: data.isScrap,
                allowNegativeStock: data.allowNegativeStock,
                inspectionRequired: data.inspectionRequired
            }
        });

        sendResponse(res, 200, 200, true, 'Raw Material created!', item);
    } catch (error)
    {
        next(error);
    }
};

module.exports = { getRawMaterial, createRawMaterial }