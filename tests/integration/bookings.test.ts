import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";
import { createHotel, createRoomWithHotelId } from "../factories/hotels-factory";
import { createBooking } from "../factories/bookings-factory";
import { prisma } from "@/config";

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });
  
  const server = supertest(app);

  describe('POST /booking', () => {
    it("should create booking", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
            userId: user.id,
            roomId: room.id
        })
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            bookingId: expect.any(Number)
        })
    })

    it("should return 401 if token is invalid", async () => {
        const user = await createUser();
        const token = "12345";
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
            userId: user.id,
            roomId: room.id
        })
        expect(response.status).toBe(401);
    })

    it("should return 403 if ticket type does not include hotel", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
            userId: user.id,
            roomId: room.id
        })
        expect(response.status).toBe(403);
    })

    it("should return 403 if ticket type is remote", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(true, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
            userId: user.id,
            roomId: room.id
        })
        expect(response.status).toBe(403);
    })

    it("should return 403 if room is fully booked", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)
        for(let i = 0; i < room.capacity; i++)
        {
            const otherUser = await createUser();
            const otherEnrollment = await createEnrollmentWithAddress(otherUser);
            await createTicket(otherEnrollment.id, ticketType.id, TicketStatus.PAID); 
            await createBooking(otherUser.id, room.id);           
        }
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
            userId: user.id,
            roomId: room.id
        })
        expect(response.status).toBe(403);
    })

    it("should return 404 if room doesn't exist", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
                userId: user.id,
                roomId: 1
            })
            expect(response.status).toBe(404);
    })
    })

    describe("GET /booking", () => {
        it("should return user booking", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, room.id);
    
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                ...booking,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                id: expect.any(Number),
                Room: expect.objectContaining({
                    capacity: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    id: expect.any(Number),
                    hotelId: expect.any(Number),
                    name: expect.any(String)                    
                })
            })
        })

        it("should return 401 if token is invalid", async () => {
            const user = await createUser();
            const token = "123456";
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, room.id);
    
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(401);
        })

        it("should return 404 if user doesn't have a reservation", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
    
            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
        })
    })

    describe("PUT /booking/:bookingId", () => {
        it("should change the room of a booking", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, room.id);
            const anotherRoom = await createRoomWithHotelId(hotel.id);
    
            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
                roomId: anotherRoom.id
            })
            expect(response.status).toBe(200);
            expect(response.body).toEqual({bookingId: String(booking.id)});
            const updatedBooking = await prisma.booking.findUnique({
                where: {
                    userId: user.id
                }
            })
            expect(updatedBooking).toEqual({
                ...booking,
                roomId: anotherRoom.id,
                updatedAt: expect.any(Date)
            })
        })

        it("should return 401 if token is invalid", async () => {
            const user = await createUser();
            const token = "123456";
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, room.id);
            const anotherRoom = await createRoomWithHotelId(hotel.id);
    
            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
                roomId: anotherRoom.id
            })
            expect(response.status).toBe(401);
        })

        it("should return 403 if user doesn't have a reservation", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const anotherRoom = await createRoomWithHotelId(hotel.id);
    
            const response = await server.put(`/booking/1`).set('Authorization', `Bearer ${token}`).send({
                roomId: anotherRoom.id
            })
            expect(response.status).toBe(403);
        })

        it("should return 403 if new room is fully book", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, room.id);
            const anotherRoom = await createRoomWithHotelId(hotel.id);
            for(let i = 0; i < anotherRoom.capacity; i++)
            {
                const otherUser = await createUser();
                const otherEnrollment = await createEnrollmentWithAddress(otherUser);
                await createTicket(otherEnrollment.id, ticketType.id, TicketStatus.PAID); 
                await createBooking(otherUser.id, anotherRoom.id);           
            }

            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
                roomId: anotherRoom.id
            })
            expect(response.status).toBe(403);
        })

        it("should return 401 if token is invalid", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user.id, room.id);
    
            const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({
                roomId: 1
            })
            expect(response.status).toBe(404);
        })
    })

    