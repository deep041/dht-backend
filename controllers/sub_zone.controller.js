const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getSubZones = async (req, res, next) => {
    let subZones = await prisma.subZone.findMany({
        include: {
            zone: {
                select: {
                    zone: true
                }
            },
            region: {
                select: {
                    region_name: true
                }
            }
        }
    });

    subZones = subZones.map(subZone => {
        if (subZone.zone) {
            subZone.zone_name = subZone.zone.zone;
            delete subZone.zone;
        }
        if (subZone.region) {
            subZone.region_name = subZone.region.region_name;
            delete subZone.region;
        }
        return subZone;
    });
    sendResponse(res, 200, 200, true, 'Sub Zone fetched successfully!', subZones);
}

const getSubZoneByZone = async (req, res, next) => {
    const { zoneId } = req.params;
    let subZones = await prisma.subZone.findMany({
        where: {
            zoneId: parseInt(zoneId)
        },
        include: {
            zone: {
                select: {
                    zone: true
                }
            },
            region: {
                select: {
                    region_name: true
                }
            }
        }
    });

    subZones = subZones.map(subZone => {
        if (subZone.zone) {
            subZone.zone_name = subZone.zone.zone;
            delete subZone.zone;
        }
        if (subZone.region) {
            subZone.region_name = subZone.region.region_name;
            delete subZone.region;
        }
        return subZone;
    });
    sendResponse(res, 200, 200, true, 'Sub Zone fetched successfully!', subZones);
}

const createSubZone = async (req, res, next) => {
    const { subZoneTitle, zoneId, regionId, status } = req.body;
    if (!subZoneTitle) {
        return sendResponse(res, 400, 400, false, 'Sub Zone Name is required!');
    }
    const subZone = await prisma.subZone.create({
        data: {
            subZoneTitle,
            zoneId,
            regionId,
            status
        }
    });
    sendResponse(res, 201, 201, true, 'Sub Zone created successfully!', subZone);
}

module.exports = { getSubZones, createSubZone, getSubZoneByZone }