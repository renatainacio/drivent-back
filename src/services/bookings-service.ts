import { notFoundError } from "@/errors";
import { bookingsRepository } from "@/repositories";

async function getBookingByUserId(userId: number){
    const booking = await bookingsRepository.getBookingByUserId(userId);
    if (!booking) throw notFoundError();
    return booking;
}

export const bookingsService = {
    getBookingByUserId
}