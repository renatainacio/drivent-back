import { prisma } from "@/config";

async function getHotels(){
    const hotels = await prisma.hotel.findMany();
    return hotels;
}

async function getHotelbyId(id: number){
    const rooms = await prisma.hotel.findMany({
        where: {
            id
        },
        include: {
            Rooms: true
        }
    })
    return rooms;
}

const hotelsRepository = {
    getHotels,
    getHotelbyId
};

export default hotelsRepository;