import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicket, getTicketTypes, getUserTickets } from '@/controllers';
import { createTicketSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getTicketTypes)
    .get('/', getUserTickets)
    .post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
