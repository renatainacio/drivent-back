
import { CreatePaymentParams } from '@/repositories';
import Joi from 'joi';

export const createPaymentSchema = Joi.object<CreatePaymentParams>({
  ticketId: Joi.number().integer().min(1).required(),
	cardData: {
		issuer: Joi.string().required(),
    number: Joi.number().integer().min(1).required(),
    name: Joi.string().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().integer().min(1).required()
	}
});
