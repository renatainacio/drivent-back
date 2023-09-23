import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPayment, getPaymentFromTicket } from '@/controllers';
import { createPaymentSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
    .all('/*', authenticateToken)
    .get('/', getPaymentFromTicket)
    .post('/process', validateBody(createPaymentSchema), createPayment);

export { paymentsRouter };
