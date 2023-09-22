import { prisma } from "@/config"


async function getTicketTypes(){
    const ticketTypes = await prisma.ticketType.findMany();
    return ticketTypes;
}

async function getUserTickets(userId: number){
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId
        }
    })
    if (!enrollment)
        return null;
    const ticket = await prisma.ticket.findUnique({
        include: {
            TicketType: true,
        },
        where: {
            enrollmentId: enrollment.id
        }
    })
    return ticket;
}

export const ticketsRepository = {
    getTicketTypes,
    getUserTickets
}