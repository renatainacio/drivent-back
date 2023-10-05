import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import { roomFullyBookedError } from "@/errors/room-fully-booked-error";
import { CreateBooking, bookingsRepository, enrollmentRepository, ticketsRepository } from "@/repositories";
import { roomsRepository } from "@/repositories/rooms-repository";
import { TicketStatus } from "@prisma/client";

async function getBookingByUserId(userId: number){
    const booking = await bookingsRepository.getBookingByUserId(userId);
    if (!booking) throw notFoundError();
    return booking;
}

async function postBooking(bookingData: CreateBooking){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(bookingData.userId);
    if (!enrollment) throw forbiddenError();
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket || ticket.status !== TicketStatus.PAID || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) throw forbiddenError();

    const room = await roomsRepository.getRoomById(bookingData.roomId);
    if (!room) throw notFoundError();
    const roomReservations = await bookingsRepository.getBookingsByRoomId(bookingData.roomId);
    if (roomReservations.length === room.capacity) throw roomFullyBookedError();

    const booking = await bookingsRepository.postBooking(bookingData);
    return booking.id;
}

export const bookingsService = {
    getBookingByUserId,
    postBooking
}