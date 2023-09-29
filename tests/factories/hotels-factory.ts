import faker from '@faker-js/faker';
import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

export async function createHotel(params: Partial<Hotel> = {}): Promise<Hotel> {
  return prisma.hotel.create({
    data: {
      name: params.name || faker.company.companyName(),
      image: params.image || faker.image.imageUrl(),
      createdAt: params.createdAt || new Date(),
      updatedAt: params.updatedAt || new Date(),
    },
  });
}
