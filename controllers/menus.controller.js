const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getMenus = async (req, res, next) => {
    let menus = await prisma.menus.findMany({
        where: {
            parent_menu_id: null
        },
        include: {
            parent: true,
            children: {
                include: {
                    children: true
                }
            }
        }
    });

    menus = menus.map(menu => {
        if (menu.parent) {
            menu.parent_menu = menu.parent.menu_name;
            delete menu.parent;
        }
        return menu;
    });
    sendResponse(res, 200, 200, true, 'Menus fetched successfully!', menus);
}

const createMenu = async (req, res, next) => {

    let { name, icon, path, parent, status, sequence } = req.body;
    
    if (!name) {
        return sendResponse(res, 400, 400, false, 'Name is required!');
    }

    if (!parent) {
        parent = null;
    }

    if (sequence && !isNaN(sequence)) {
        sequence = parseInt(sequence);
    }

    const menu = await prisma.menus.create({
        data: {
            menu_name: name,
            menu_url: path,
            icon_name: icon,
            parent_menu_id: parent,
            status,
            sequence
        }
    });
    sendResponse(res, 201, 201, true, 'Menu created successfully!', menu);
}

module.exports = { getMenus, createMenu }