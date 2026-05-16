const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getUsers = async (req, res, next) => {
    const users = await prisma.users.findMany({
        include: {
            department: {
                select: {
                    name: true
                }
            },
            role: {
                select: {
                    role_name: true
                }
            },
            region: {
                select: {
                    region_name: true
                }
            },
            zone: {
                select: {
                    zone: true
                }
            },
            sub_zone: {
                select: {
                    subZoneTitle: true
                }
            }
        }
    });

    const formattedUsers = users.map(user => {
        const formattedUser = { ...user };
        if (user.department) {
            formattedUser.department_name = user?.department?.name;
            delete formattedUser.department;
        }
        if (user.role) {
            formattedUser.role_name = user?.role?.role_name;
            delete formattedUser.role;
        }
        if (user.region) {
            formattedUser.region_name = user?.region?.region_name;
            delete formattedUser.region;
        }
        if (user.zone) {
            formattedUser.zone_name = user?.zone?.zone;
            delete formattedUser.zone;
        }   
        if (user.sub_zone) {
            formattedUser.sub_zone_name = user?.sub_zone?.subZoneTitle;
            delete formattedUser.sub_zone;
        }
        return formattedUser;
    });
    sendResponse(res, 200, 200, true, 'Users fetched successfully!', formattedUsers);
}

const getAuthUsers = async (req, res, next) => {
    const users = await prisma.users.findMany({
        where: {
            is_auth_person: true
        }
    });
    sendResponse(res, 200, 200, true, 'Auth Users fetched successfully!', users);
}

const login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return sendResponse(res, 400, 400, false, 'Username and password are required.');
    }

    const user = await prisma.users.findUnique({
        where: { username },
        include: {
            role: {
                select: {
                    role_name: true
                }
            }
        }
    });

    if (!user || user.password !== password) {
        return sendResponse(res, 401, 401, false, 'Invalid username or password.');
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            role_id: user.role_id,
            role_name: user.role?.role_name
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    sendResponse(res, 200, 200, true, 'Login successful.', {
        token,
        user: {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            role_id: user.role_id,
            role_name: user.role?.role_name
        }
    });
};

const createUser = async (req, res, next) => {
    const { first_name, last_name, username, contact_no, email, department_id, role_id, reporting_to, region_id, zone_id, sub_zone_id, password, profile_picture, is_auth_person } = req.body;
    
    const user = await prisma.users.create({
        data: {
            first_name, last_name, username, contact_no, email, department_id, role_id, reporting_to, region_id, zone_id, sub_zone_id, password, profile_picture, is_auth_person
        }
    });
    sendResponse(res, 201, 201, true, 'User created successfully!', user);
}

module.exports = { getUsers, createUser, getAuthUsers, login }