import { conflictError, notFoundError } from "@/errors";
import { CreateTicketParams, enrollmentRepository, ticketsRepository } from "@/repositories";

async function getTicketTypes(){
    const ticketTypes = await ticketsRepository.getTicketTypes();
    return ticketTypes;
}

async function getUserTickets(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
    const ticket = await ticketsRepository.getUserTickets(enrollment.id);
    if (!ticket) throw notFoundError();
    return ticket;
}

async function createTicket(userId: number, ticketType: CreateTicketParams){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
    const userAlreadyHaveATicket = ticketsRepository.getUserTickets(enrollment.id);
    if (userAlreadyHaveATicket) throw conflictError("User already has a ticket");
    const ticket = await ticketsRepository.createTicket(enrollment.id, ticketType);
    return ticket;
}

export const ticketsServices = {
    getTicketTypes,
    getUserTickets,
    createTicket
}