import { TicketStatus } from '@prisma/client';
import { notFoundError, paymentRequiredError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { hotelsRepository } from '@/repositories/hotels-repository';

async function checkIfElegibleForHotel(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== TicketStatus.PAID || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote)
    throw paymentRequiredError();
}

async function getHotels(userId: number) {
  await checkIfElegibleForHotel(userId);
  const hotels = await hotelsRepository.getHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotelsById(id: number, userId: number) {
  await checkIfElegibleForHotel(userId);
  const hotel = await hotelsRepository.getHotelbyId(id);
  if (!hotel) throw notFoundError();
  return hotel;
}

export const hotelsService = {
  getHotels,
  getHotelsById,
};
