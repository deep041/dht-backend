const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getCountries = async (req, res, next) => {
    const country = await prisma.country.findMany();
    sendResponse(res, 200, 200, true, 'Country fetched successfully!', country);
}

const getStates = async (req, res, next) => {
    const countryId = Number(req.query.country_id);
    const states = await prisma.state.findMany({
        where: {
            country_id: countryId
        }
    });
    sendResponse(res, 200, 200, true, 'State fetched successfully!', states);
}

module.exports = { getCountries, getStates }