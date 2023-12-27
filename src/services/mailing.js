const nodemailer = require ('nodemailer');
const { SERVICE_MAILING, PORT_MAILING, USER_MAILING, PASS_MAILING } = require('../public/js/config');
//import config from '../public/js/config.js';

class MailingService{
    constructor(){
        this.client = nodemailer.createTransport({
            service: SERVICE_MAILING,
            port: PORT_MAILING,
            auth:{
            user: USER_MAILING,
            pass: PASS_MAILING
        },
        tls: {
          rejectUnauthorized: false
        }
        })
    }

    sendSimpleMail=async({from,to,subject,html,attachments=[]})=>{
        let result = await this.client.sendMail({
            from,
            to,
            subject,
            html,
            attachments
        })
        return result
    }

}

module.exports = MailingService;