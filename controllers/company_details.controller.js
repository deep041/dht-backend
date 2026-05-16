const prisma = require('../utils/prisma');
const sendResponse = require('../utils/response');

const getCompanyDetails = async (req, res, next) => {
    const companyDetails = await prisma.companyDetails.findMany();
    sendResponse(res, 200, 200, true, 'Company Details fetched successfully!', companyDetails);
}

const createCompanyDetails = async (req, res, next) => {
    let { company_name, company_short_name, proprietor, phone, phone_2, email_id,
            email_id_2, country_id, state_id, pin_code, place, state_code, address_line_1,
            address_line_2, gst_applicable, gst_no, pan_no, cin_no, llpin_no, website, logo,
            asp_id, asp_password, portal_client_user_name, portal_client_password, id } = req.body;

    phone_2 = phone_2 || '';
    email_id_2 = email_id_2 || '';
    logo = logo || '';
    cin_no = cin_no || '';
    llpin_no = llpin_no || '';

    if (id) {
        const companyDetails = await prisma.companyDetails.update({
            where: { id },
            data: {
                company_name, company_short_name, proprietor, phone, phone_2, email_id,
                email_id_2, country_id, state_id, pin_code, place, state_code, address_line_1,
                address_line_2, gst_applicable, gst_no, pan_no, cin_no, llpin_no, website, logo,
                asp_id, asp_password, portal_client_user_name, portal_client_password
            }
        });
        sendResponse(res, 200, 200, true, 'Company Details updated successfully!', companyDetails);
        return;
    }
    
    const companyDetails = await prisma.companyDetails.create({
        data: {
            company_name, company_short_name, proprietor, phone, phone_2, email_id,
            email_id_2, country_id, state_id, pin_code, place, state_code, address_line_1,
            address_line_2, gst_applicable, gst_no, pan_no, cin_no, llpin_no, website, logo,
            asp_id, asp_password, portal_client_user_name, portal_client_password
        }
    });
    sendResponse(res, 201, 201, true, 'Company Details updated successfully!', companyDetails);
}

module.exports = { getCompanyDetails, createCompanyDetails }