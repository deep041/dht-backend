const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getHSN = async (req, res, next) => {
    const HSN = await prisma.hsnMaster.findMany();
    sendResponse(res, 200, 200, true, 'HSN fetched successfully!', HSN);
}

const createHSN = async (req, res, next) =>
{
    try
    {
        const { hsnCode, gstSlab, description } = req.body;

        const data = await prisma.hsnMaster.create({
            data: {
                hsnCode,
                gstSlab: Number(gstSlab),
                description
            }
        });

        res.status(201).json({
            success: true,
            message: 'HSN created successfully',
            data
        });

    } catch (error)
    {
        next(error);
    }
};

module.exports = { getHSN, createHSN }