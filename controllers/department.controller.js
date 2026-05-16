const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getDepartment = async (req, res, next) => {
    const department = await prisma.department.findMany();
    sendResponse(res, 200, 200, true, 'Department fetched successfully!', department);
}

const createDepartment = async (req, res, next) => {
    const { code, name } = req.body;
    if (!code) {
        return sendResponse(res, 400, 400, false, 'Department Code is required!');
    }
    if (!name) {
        return sendResponse(res, 400, 400, false, 'Department Name is required!');
    }
    const department = await prisma.department.create({
        data: {
            code,
            name
        }
    });
    sendResponse(res, 201, 201, true, 'Department created successfully!', department);
}

module.exports = { getDepartment, createDepartment }