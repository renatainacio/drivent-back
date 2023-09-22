import { CreateTicketParams } from '@/repositories';
import Joi from 'joi';

export const createTicketSchema = Joi.object<CreateTicketParams>({
  ticketTypeId: Joi.number().integer().min(1)
});
