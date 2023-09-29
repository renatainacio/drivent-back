import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { Room } from "@prisma/client";

export async function createRoom(params: Partial<Room> = {}): Promise<Room>{

    return prisma.room.create({
        data: {
            name: params.name || faker.music.genre(),
            capacity: params.capacity || faker.datatype.number(),
            hotelId: params.hotelId || faker.datatype.number(),
            createdAt: params.createdAt || new Date(),
            updatedAt: params.updatedAt || new Date()
        }
    })
  }