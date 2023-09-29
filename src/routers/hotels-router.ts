import { Router } from 'express';
import { getHotelbyId, getHotels } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getHotelbyId);

export { hotelsRouter };
