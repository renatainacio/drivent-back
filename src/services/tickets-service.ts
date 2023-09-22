import { ticketsRepository } from "@/repositories";

async function getTicketTypes(){
    const ticketTypes = await ticketsRepository.getTicketTypes();
    return ticketTypes;
}

async function getUserTickets(userId: number){
    const ticket = await ticketsRepository.getUserTickets(userId);
    return ticket;
}

export const ticketsServices = {
    getTicketTypes,
    getUserTickets
}