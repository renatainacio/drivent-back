import { prisma } from "@/config";

async function getHotels(){
    const hotels = await prisma.hotel.findMany();
    return hotels;
}

async function getHotelbyId(id: number){
    const room = await prisma.hotel.findUnique({
        where: {
            id
        },
        include: {
            Rooms: true
        }
    })
    return room;
}

const hotelsRepository = {
    getHotels,
    getHotelbyId
};

export default hotelsRepository;