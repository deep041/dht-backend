const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getPlantUnit = async (req, res, next) => {
    const plantUnit = await prisma.plantUnit.findMany();
    sendResponse(res, 200, 200, true, 'Plant unit fetched successfully!', plantUnit);
}

const createPlantUnit = async (req, res, next) => {
    const { unit_name, company_name, address_line_1, address_line_2, place, stateId, countryId, state_code, pin_code, gst_no, pan_no, cin_no, contact_no, email_id } = req.body;
    // if (!region_name) {
    //     return sendResponse(res, 400, 400, false, 'Region Name is required!');
    // }
    const plantUnit = await prisma.plantUnit.create({
        data: {
            unit_name, company_name, address_line_1, address_line_2, place, stateId, countryId, state_code, pin_code, gst_no, pan_no, cin_no, contact_no, email_id
        }
    });
    sendResponse(res, 201, 201, true, 'Plant Unit created successfully!', plantUnit);
}

module.exports = { getPlantUnit, createPlantUnit }