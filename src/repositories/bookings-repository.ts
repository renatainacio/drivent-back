import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function getBookingByUserId(userId: number){
    return prisma.booking.findUnique({
        where: {
            userId
        },
        include: {
            Room: true
        }
    });
}

async function getBookingsByRoomId(roomId: number){
    return prisma.booking.findMany({
        where: {
            roomId
        }
    })
}

export type CreateBooking = {
    roomId: number,
    userId: number
}

async function postBooking(booking: CreateBooking){
    return prisma.booking.create({
        data: booking
    })
}

async function updateBooking(bookingId: number, roomId: number){
    return prisma.booking.update({
        data: {
            roomId: roomId
        },
        where: {
            id: bookingId
        }
    })
}



export const bookingsRepository = {
    getBookingByUserId,
    postBooking,
    getBookingsByRoomId,
    updateBooking
  };
  