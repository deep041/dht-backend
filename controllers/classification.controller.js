const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getClassification = async (req, res, next) => {
    const classification = await prisma.classification.findMany({
        include: {
            account: true
        }
    });
    sendResponse(res, 200, 200, true, 'Classification fetched successfully!', classification);
}

const createClassification = async (req, res, next) =>
{
    try
    {
        const {
            isUsedInItemName,
            name,
            shortName,
            accountId
        } = req.body;

        const data = await prisma.classification.create({
            data: {
                isUsedInItemName,
                name,
                shortName,
                accountId: Number(accountId)
            }
        });

        res.json({
            success: true,
            message: 'Classification created',
            data
        });

    } catch (error)
    {
        next(error);
    }
};

module.exports = { getClassification, createClassification }