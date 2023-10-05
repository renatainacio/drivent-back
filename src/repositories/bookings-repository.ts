import { prisma } from "@/config";

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

export const bookingsRepository = {
    getBookingByUserId
  };
  