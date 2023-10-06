import { getBooking, postBooking, updateBooking } from "@/controllers/booking-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', postBooking)
  .put('/:bookingId', updateBooking)

export { bookingsRouter };
