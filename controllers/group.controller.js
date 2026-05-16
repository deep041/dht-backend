const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getGroup = async (req, res, next) => {
    const group = await prisma.group.findMany({
        include: {
            category: true
        }
    });
    sendResponse(res, 200, 200, true, 'Group fetched successfully!', group);
}

const createGroup = async (req, res, next) =>
{
    try
    {
        const {
            isUsedInItemName,
            name,
            shortName,
            categoryId
        } = req.body;

        const data = await prisma.group.create({
            data: {
                isUsedInItemName,
                name,
                shortName,
                categoryId: Number(categoryId)
            }
        });

        sendResponse(res, 200, 200, true, 'Group fetched successfully!', data);
    } catch (error)
    {
        next(error);
    }
};

module.exports = { getGroup, createGroup }