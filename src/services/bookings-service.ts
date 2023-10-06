import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import { roomFullyBookedError } from "@/errors/room-fully-booked-error";
import { CreateBooking, bookingsRepository, enrollmentRepository, ticketsRepository } from "@/repositories";
import { roomsRepository } from "@/repositories/rooms-repository";
import { Room, TicketStatus } from "@prisma/client";

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

    const room = await checkIfRoomExists(bookingData.roomId);
    await checkIfRoomAvailable(room);

    const booking = await bookingsRepository.postBooking(bookingData);
    return booking.id;
}

async function updateBooking(bookingId: number, roomId: number, userId: number){

    const room = await checkIfRoomExists(roomId);
    await checkIfRoomAvailable(room);
    const userBooking = await bookingsRepository.getBookingByUserId(userId);
    if (!userBooking) throw forbiddenError();

    await bookingsRepository.updateBooking(bookingId, roomId);
}

async function checkIfRoomExists(roomId: number){
    const room = await roomsRepository.getRoomById(roomId);
    if (!room) throw notFoundError();
    return room;
}

async function checkIfRoomAvailable(room: Room){
    const roomReservations = await bookingsRepository.getBookingsByRoomId(room.id);
    if (roomReservations.length === room.capacity) throw roomFullyBookedError();
}

export const bookingsService = {
    getBookingByUserId,
    postBooking,
    updateBooking
}