const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getPartyGroups = async (req, res, next) => {
    const partyGroups = await prisma.partyGroups.findMany();
    sendResponse(res, 200, 200, true, 'Party Groups fetched successfully!', partyGroups);
}

const createPartyGroups = async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return sendResponse(res, 400, 400, false, 'Name is required!');
    }
    const partyGroups = await prisma.partyGroups.create({
        data: {
            name
        }
    });
    sendResponse(res, 201, 201, true, 'Party Groups created successfully!', partyGroups);
}

module.exports = { getPartyGroups, createPartyGroups }