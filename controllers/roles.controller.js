const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getRoles = async (req, res, next) => {
    const roles = await prisma.roles.findMany();
    sendResponse(res, 200, 200, true, 'Roles fetched successfully!', roles);
}

const createRole = async (req, res, next) => {
    const { role_name } = req.body;
    if (!role_name) {
        return sendResponse(res, 400, 400, false, 'Name is required!');
    }
    const role = await prisma.roles.create({
        data: {
            role_name
        }
    });
    sendResponse(res, 201, 201, true, 'Role created successfully!', role);
}

module.exports = { getRoles, createRole }