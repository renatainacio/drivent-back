import { prisma } from "@/config"
import { notFoundError } from "@/errors";
import { Ticket, TicketStatus } from "@prisma/client";


async function getTicketTypes(){
    const ticketTypes = await prisma.ticketType.findMany();
    return ticketTypes;
}

async function getUserTickets(enrollmentId: number){
    const ticket = await prisma.ticket.findUnique({
        include: {
            TicketType: true,
        },
        where: {
            enrollmentId: enrollmentId
        }
    })
    return ticket;
}

async function createTicket(enrollmentId: number, ticketType: CreateTicketParams){
    const date = new Date();
    const ticket = await prisma.ticket.create({
        data: {
            ticketTypeId: ticketType.ticketTypeId,
            enrollmentId: enrollmentId,
            status: TicketStatus.RESERVED,
            createdAt: date,
            updatedAt: date
        },
        include: {
            TicketType: true
        }
    });
    console.log(ticket);
    return ticket;
}

export type CreateTicketParams = { ticketTypeId: number };

export const ticketsRepository = {
    getTicketTypes,
    getUserTickets,
    createTicket
}