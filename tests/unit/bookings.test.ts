import { bookingsRepository, enrollmentRepository, ticketsRepository } from "@/repositories"
import { roomsRepository } from "@/repositories/rooms-repository"
import { bookingsService } from "@/services"
import { TicketStatus } from "@prisma/client"

describe("Bookings Services Unit Tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
      });

    it("should throw an error if user is not enrolled in the event", () => {
        jest
            .spyOn(enrollmentRepository, "findWithAddressByUserId")
            .mockImplementationOnce((): any => {})

        const result = bookingsService.postBooking({roomId: 1, userId: 1});
        expect(result).rejects.toEqual({
                name: 'ForbiddenError',
                message: 'Action forbidden'
        })
    })

    it("should throw an error if user has no ticket", () => {
        jest
        .spyOn(enrollmentRepository, "findWithAddressByUserId")
        .mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockImplementationOnce((): any => {})

        const result = bookingsService.postBooking({roomId: 1, userId: 1});
        expect(result).rejects.toEqual({
                name: 'ForbiddenError',
                message: 'Action forbidden'
        })
    })

    it("should throw an error if ticket is not paid", () => {
        jest
        .spyOn(enrollmentRepository, "findWithAddressByUserId")
        .mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockImplementationOnce((): any => {
                return {
                    id: 1,
                    ticketTypeId: 1,
                    enrollmentId: 1,
                    status: TicketStatus.RESERVED,
                    TicketType: {
                        isRemote: false,
                        includesHotel: true
                    }
                }
            })

        const result = bookingsService.postBooking({roomId: 1, userId: 1});
        expect(result).rejects.toEqual({
                name: 'ForbiddenError',
                message: 'Action forbidden'
        })
    })

    it("should throw an error if ticket is remote", () => {
        jest
        .spyOn(enrollmentRepository, "findWithAddressByUserId")
        .mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockImplementationOnce((): any => {
                return {
                    id: 1,
                    ticketTypeId: 1,
                    enrollmentId: 1,
                    status: TicketStatus.PAID,
                    TicketType: {
                        isRemote: true,
                        includesHotel: true
                    }
                }
            })

        const result = bookingsService.postBooking({roomId: 1, userId: 1});
        expect(result).rejects.toEqual({
                name: 'ForbiddenError',
                message: 'Action forbidden'
        })
    })

    it("should throw an error if ticket is remote", () => {
        jest
        .spyOn(enrollmentRepository, "findWithAddressByUserId")
        .mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockImplementationOnce((): any => {
                return {
                    id: 1,
                    ticketTypeId: 1,
                    enrollmentId: 1,
                    status: TicketStatus.PAID,
                    TicketType: {
                        isRemote: false,
                        includesHotel: false
                    }
                }
            })

        const result = bookingsService.postBooking({roomId: 1, userId: 1});
        expect(result).rejects.toEqual({
                name: 'ForbiddenError',
                message: 'Action forbidden'
        })
    })

    it("should throw an error if room doesn't exist", () => {
        jest
        .spyOn(enrollmentRepository, "findWithAddressByUserId")
        .mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockImplementationOnce((): any => {
                return {
                    id: 1,
                    ticketTypeId: 1,
                    enrollmentId: 1,
                    status: TicketStatus.PAID,
                    TicketType: {
                        isRemote: false,
                        includesHotel: true
                    }
                }
            })

        jest
            .spyOn(roomsRepository, "getRoomById")
            .mockImplementationOnce(():any => {})

        const result = bookingsService.postBooking({roomId: 1, userId: 1});
        expect(result).rejects.toEqual({
                name: 'NotFoundError',
                message: 'No result for this search!'
        })
    })

    it("should throw an error if room is not available", () => {
        jest
        .spyOn(enrollmentRepository, "findWithAddressByUserId")
        .mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockImplementationOnce((): any => {
                return {
                    id: 1,
                    ticketTypeId: 1,
                    enrollmentId: 1,
                    status: TicketStatus.PAID,
                    TicketType: {
                        isRemote: false,
                        includesHotel: true
                    }
                }
            })

        jest
            .spyOn(roomsRepository, "getRoomById")
            .mockImplementationOnce(():any => {
                return {
                    id: 1,
                    capacity: 2
                }
            })

            jest
            .spyOn(bookingsRepository, "getBookingsByRoomId")
            .mockImplementationOnce(():any => {
                return [
                        {id: 1},
                        {id: 2}
                    ]
            })

        const result = bookingsService.postBooking({roomId: 1, userId: 1});
        expect(result).rejects.toEqual({
                name: 'RoomFullyBookedError',
                message: 'The room is fully booked'
        })
    })
})