const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getItemTransactions = async (req, res, next) => {
    try {
        const { sourceModule, sourceId, action, limit = '100' } = req.query;

        const where = {};

        if (sourceModule) {
            where.sourceModule = sourceModule;
        }

        if (sourceId) {
            where.sourceId = Number(sourceId);
        }

        if (action) {
            where.action = action;
        }

        const transactions = await prisma.itemTransaction.findMany({
            where,
            include: {
                item: {
                    select: {
                        id: true,
                        itemName: true,
                        itemType: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: Math.min(Number(limit) || 100, 500)
        });

        sendResponse(res, 200, 200, true, 'Item transactions fetched successfully!', transactions);
    } catch (error) {
        next(error);
    }
};

const getItemTransactionsByItemId = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { limit = '100' } = req.query;

        const transactions = await prisma.itemTransaction.findMany({
            where: { itemId: Number(itemId) },
            include: {
                item: {
                    select: {
                        id: true,
                        itemName: true,
                        itemType: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: Math.min(Number(limit) || 100, 500)
        });

        sendResponse(res, 200, 200, true, 'Item transactions fetched successfully!', transactions);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getItemTransactions,
    getItemTransactionsByItemId
};
