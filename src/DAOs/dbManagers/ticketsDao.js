const Tickets = require("../models/mongo/ticket.model");

const { v4: uuidv4 } = require('uuid');

class TicketsDao {
    constructor(logger) {
        this.logger = logger;
    }

    getAll = async () => {
        try {
            let products = await Tickets.find();
            return products;
        }
        catch (error) {
            this.logger.info(error);
            return null;
        }

    }

    getOne = async (id) => {
        try {
            let product = await Tickets.findOne({ _id: id });
            return product;
        }
        catch (error) {
            this.logger.info(error);
            return null;
        }

    }

    createTicket = async (ticket) => {
        try {
            let result = await Tickets.create(ticket);
            return result;
        }
        catch (error) {
            this.logger.info(error);
            return null;
        }

    }

    resolveTicket = async (id, ticket) => {
        try {
            let updateTicket = await Tickets.updateOne({ _id: id }, { $set: ticket });
            return updateTicket;
        }
        catch (error) {
            this.logger.info(error);
            return null;
        }
    }

    createCode = async () => {
        try {
            let isCodeUnique = false;
            let ticketCode;
            // Generar código autogenerado único para el ticket
            while (!isCodeUnique) {
                ticketCode = uuidv4();
                const existingTicket = await Tickets.findOne({ code:ticketCode });
                if (!existingTicket) {
                    isCodeUnique = true;
                }
            }
            return ticketCode;
        }
        catch (error) {
            this.logger.info(error);
            return null
        }
    }

}

module.exports = TicketsDao;