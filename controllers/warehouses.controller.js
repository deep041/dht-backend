const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getWarehouses = async (req, res, next) => {
    let warehouses = await prisma.warehouses.findMany({
        include: {
            plantUnit: true
        }
    });
    warehouses = warehouses.map(warehouse => {
        return {
            id: warehouse.id,
            name: warehouse.name,
            description: warehouse.description,
            plant_unit_id: warehouse.plant_unit_id,
            plant_unit_name: warehouse.plantUnit ? warehouse.plantUnit.unit_name : null
        }
    });
    sendResponse(res, 200, 200, true, 'Warehouses fetched successfully!', warehouses);
}

const createWarehouse = async (req, res, next) => {
    const { name, description, plant_unit_id } = req.body;
    if (!name) {
        return sendResponse(res, 400, 400, false, 'Name is required!');
    }
    const warehouses = await prisma.warehouses.create({
        data: {
            name,
            description,
            plant_unit_id
        }
    });
    sendResponse(res, 201, 201, true, 'Warehouses created successfully!', warehouses);
}

module.exports = { getWarehouses, createWarehouse }