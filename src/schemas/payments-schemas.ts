
import { CreatePaymentParams } from '@/repositories';
import Joi from 'joi';

export const createPaymentSchema = Joi.object<CreatePaymentParams>({
  ticketId: Joi.number().integer().min(1).required(),
	cardData: {
		issuer: Joi.string().required(),
    number: Joi.string().required().min(15).max(15),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.string().min(3).max(3).required()
	}
});
