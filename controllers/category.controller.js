const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getCategories = async (req, res, next) => {
    const data = await prisma.category.findMany({
        include: {
            classification: true
        }
    });
    sendResponse(res, 200, 200, true, 'Categories fetched successfully!', data);
}

const createCategory = async (req, res, next) =>
{
    try
    {
        const {
            isUsedInItemName,
            name,
            shortName,
            classificationId
        } = req.body;

        const data = await prisma.category.create({
            data: {
                isUsedInItemName,
                name,
                shortName,
                classificationId: Number(classificationId)
            }
        });

        sendResponse(res, 200, 200, true, 'Category created!', data);

    } catch (error)
    {
        next(error);
    }
};

module.exports = { getCategories, createCategory }