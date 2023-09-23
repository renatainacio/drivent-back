import { notFoundError, requestError, unauthorizedError } from "@/errors";
import { CreatePaymentParams, paymentsRepository, ticketsRepository } from "@/repositories";


async function getPaymentFromTicket(ticketId: number, userId: number){
    if (!ticketId || isNaN(ticketId)) throw requestError(400, "Ticket Id not informed");
    const ticket = await ticketsRepository.getTicketById(ticketId);
    if (!ticket) throw notFoundError();
    if (ticket.Enrollment.userId !== userId) throw unauthorizedError();
    const payment = await paymentsRepository.getPaymentFromTicket(ticketId);
    return payment;
}

async function createPayment(payment: CreatePaymentParams){
    const ticket = await ticketsRepository.getTicketById(payment.ticketId);
    if (!ticket) throw notFoundError();
    const result = await paymentsRepository.createPayment(payment, ticket.TicketType.price);
    return result;
}

export const paymentsService = {
    createPayment,
    getPaymentFromTicket
}