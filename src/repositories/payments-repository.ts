import { prisma } from "@/config"


async function getPaymentFromTicket(ticketId: number){
    const payment = await prisma.payment.findUnique({
        where: {
            ticketId
        }
    });
    return payment;
}

async function createPayment(payment: CreatePaymentParams, ticketPrice: number){
    const date = new Date();
    await prisma.ticket.update({
        data: {
            status: "PAID"
        },
        where: {
            id: payment.ticketId
        }
    })
    const result = await prisma.payment.create({
        data: {
            ticketId: payment.ticketId,
            cardIssuer: payment.cardData.issuer,
            value: ticketPrice,
            cardLastDigits: payment.cardData.number.slice(-4),
            createdAt: date,
            updatedAt: date
        }
    });
    return result;
}

export type CreatePaymentParams = { 
    ticketId: number,
	cardData: {
        issuer: string,
        number: string,
        name: string,
        expirationDate: string,
        cvv: string
	}
};

export const paymentsRepository = {
    getPaymentFromTicket,
    createPayment
}