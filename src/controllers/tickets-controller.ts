import { ticketsServices } from "@/services";
import { Request, Response } from "express";

export async function getTicketTypes(_req: Request, res: Response){
    const ticketTypes = await ticketsServices.getTicketTypes();
    return res.send(ticketTypes);
}