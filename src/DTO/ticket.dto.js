class TicketDto {
    constructor(ticketRegister) {
        this.code = ticketRegister.codeT;
        this.purchase_datetime = ticketRegister.purchase_datetime;
        this.products = ticketRegister.productList;
        this.amount = ticketRegister.addToPayment;
        this.purcharser = ticketRegister.userId;
    }
}

module.exports = TicketDto;