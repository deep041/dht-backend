const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getRegions = async (req, res, next) => {
    const roles = await prisma.region.findMany();
    sendResponse(res, 200, 200, true, 'Region fetched successfully!', roles);
}

const createRegion = async (req, res, next) => {
    const { region_name, status } = req.body;
    if (!region_name) {
        return sendResponse(res, 400, 400, false, 'Region Name is required!');
    }
    const role = await prisma.region.create({
        data: {
            region_name,
            status
        }
    });
    sendResponse(res, 201, 201, true, 'Region created successfully!', role);
}

module.exports = { getRegions, createRegion }