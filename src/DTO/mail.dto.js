class MailDto {
    constructor(emailStructure) {
        this.from = emailStructure.from;
        this.to = emailStructure.to;
        this.subject = emailStructure.subject;
        this.html = emailStructure.html;
    }
}

module.exports = MailDto;