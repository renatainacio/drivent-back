import { AuthenticatedRequest } from "@/middlewares";
import { ticketsServices } from "@/services";
import { Request, Response } from "express";

export async function getTicketTypes(_req: Request, res: Response){
    const ticketTypes = await ticketsServices.getTicketTypes();
    return res.send(ticketTypes);
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response){
    const userId = req.userId;
    const ticket = await ticketsServices.getUserTickets(userId);
    return res.send(ticket);
}

export async function createTicket(req: AuthenticatedRequest, res: Response){
    const userId = req.userId;
    await ticketsServices.createTicket(userId, req.body);
}