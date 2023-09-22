import { ticketsRepository } from "@/repositories";

async function getTicketTypes(){
    const ticketTypes = await ticketsRepository.getTicketTypes();
    return ticketTypes;
}

export const ticketsServices = {
    getTicketTypes
}