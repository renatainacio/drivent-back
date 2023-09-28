import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotel, createPayment, createRemoteTicketType, createTicket, createTicketType, createTicketTypeWithHotels, createTicketTypeWithoutHotels, createUser } from "../factories";
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from "@prisma/client";
import { prisma } from "@/config";

beforeAll(async () => {
    await init();
    await cleanDb();
  });

const server = supertest(app);

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/hotels');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if no enrollment exists', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        })

        it('should respond with status 404 if no ticket exists', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        })

        it('should respond with status 402 if ticket has not been paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        })

        it('should respond with status 402 if ticket type is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createRemoteTicketType();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            await createPayment(ticket.id, ticketType.price);
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        })

        it('should respond with status 402 if ticket type doesnt include hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithoutHotels();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            await createPayment(ticket.id, ticketType.price);
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        })

        it('should respond with status 404 if no hotel exists', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotels();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            await prisma.ticket.update({
                data: {
                    status: TicketStatus.PAID
                },
                where : {
                    id: ticket.id
                }
            })
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        })

        it('should respond with status 200 and a list of hotels', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotels();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            await prisma.ticket.update({
                data: {
                    status: TicketStatus.PAID
                },
                where : {
                    id: ticket.id
                }
            })
            const hotel1 = await createHotel();
            const hotel2 = await createHotel();
            const hotel3 = await createHotel();
            const hotel4 = await createHotel();
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual([
                {
                    ...hotel1,
                    createdAt: hotel1.createdAt.toISOString(),
                    updatedAt: hotel1.updatedAt.toISOString()
                },
                {
                    ...hotel2,
                    createdAt: hotel2.createdAt.toISOString(),
                    updatedAt: hotel2.updatedAt.toISOString()
                },
                {
                    ...hotel3,
                    createdAt: hotel3.createdAt.toISOString(),
                    updatedAt: hotel3.updatedAt.toISOString()
                },
                {
                    ...hotel4,
                    createdAt: hotel4.createdAt.toISOString(),
                    updatedAt: hotel4.updatedAt.toISOString()
                }
            ]);
        })
    })
});