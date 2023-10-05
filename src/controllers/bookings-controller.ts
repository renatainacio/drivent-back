import { AuthenticatedRequest } from "@/middlewares";
import { bookingsService } from "@/services/bookings-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    const booking = await bookingsService.getBookingByUserId(Number(userId));
    res.status(httpStatus.OK).send(booking);
}

export async function postBooking(req: AuthenticatedRequest, res: Response){

}

export async function updateBooking(req: AuthenticatedRequest, res: Response){

}