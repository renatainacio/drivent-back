import { AuthenticatedRequest } from "@/middlewares";
import { paymentsService } from "@/services";
import { Response } from "express";

export async function getPaymentFromTicket(req: AuthenticatedRequest, res: Response){
    const ticketId = Number(req.query.ticketId);
    const payment = await paymentsService.getPaymentFromTicket(ticketId, req.userId);
    res.send(payment);
}

export async function createPayment(req: AuthenticatedRequest, res: Response){
    const payment = req.body;
    const result = await paymentsService.createPayment(payment);
    res.status(201).send(result);
}