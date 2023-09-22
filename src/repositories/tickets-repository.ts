import { prisma } from "@/config"


async function getTicketTypes(){
    const ticketTypes = await prisma.ticketType.findMany();
    return ticketTypes;
}

async function getUserTickets(){
    
}

export const ticketsRepository = {
    getTicketTypes
}