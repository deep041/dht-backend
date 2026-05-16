const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getSubGroups = async (req, res, next) => {
    const subGroup = await prisma.subGroup.findMany({
        include: {
            group: true
        }
    });
    sendResponse(res, 200, 200, true, 'Sub Group fetched successfully!', subGroup);
}

const createSubGroup = async (req, res, next) =>
{
    try
    {
        const {
            isUsedInItemName,
            name,
            shortName,
            groupId
        } = req.body;

        const data = await prisma.subGroup.create({
            data: {
                isUsedInItemName,
                name,
                shortName,
                groupId: Number(groupId)
            }
        });

        sendResponse(res, 200, 200, true, 'Sub Group created successfully!', data);

    } catch (error)
    {
        next(error);
    }
};

const getSubGroupsByGroupId = async (req, res, next) =>
{
    try
    {
        const { groupId } = req.params;

        const subGroups = await prisma.subGroup.findMany({
            where: {
                groupId: Number(groupId)
            }
        });

        sendResponse(res, 200, 200, true, 'Sub Groups fetched successfully!', subGroups);
    } catch (error)
    {
        next(error);
    }
};

module.exports = { getSubGroups, createSubGroup, getSubGroupsByGroupId }