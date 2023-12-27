const MailingService = require('../services/mailing.js');

const mailer = new MailingService();



class emailNotifications {
    async sendMail(from, to, subject, bodyEmail){
        try {
            const mail = await mailer.sendSimpleMail({
                from: from,
                to: to,
                subject: subject,
                html: bodyEmail
            });
            return mail
        } catch (error) {
            throw error;
        }
    }


}

module.exports = emailNotifications;