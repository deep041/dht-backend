const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getZones = async (req, res, next) => {
    let zones = await prisma.zone.findMany({
        include: {
            region: {
                select: {
                    region_name: true
                }
            }
        }
    });

    zones = zones.map(zone => {
        if (zone.region) {
            zone.region_name = zone.region.region_name;
            delete zone.region;
        }
        return zone;
    });
    sendResponse(res, 200, 200, true, 'Region fetched successfully!', zones);
}

const getZoneByRegion = async (req, res, next) => {
    const { regionId } = req.params;
    let zones = await prisma.zone.findMany({
        where: {
            regionId: parseInt(regionId)
        },
        include: {
            region: {
                select: {
                    region_name: true
                }
            }
        }
    });

    zones = zones.map(zone => {
        if (zone.region) {
            zone.region_name = zone.region.region_name;
            delete zone.region;
        }
        return zone;
    });
    sendResponse(res, 200, 200, true, 'Region fetched successfully!', zones);
}

const createZone = async (req, res, next) => {
    const { zone, regionId } = req.body;
    if (!zone) {
        return sendResponse(res, 400, 400, false, 'Zone Name is required!');
    }
    const role = await prisma.zone.create({
        data: {
            zone,
            regionId
        }
    });
    sendResponse(res, 201, 201, true, 'Zone created successfully!', role);
}

module.exports = { getZones, createZone, getZoneByRegion }