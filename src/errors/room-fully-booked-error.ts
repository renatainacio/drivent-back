import { ApplicationError } from '@/protocols';

export function roomFullyBookedError(): ApplicationError {
  return {
    name: 'RoomFullyBookedError',
    message: 'The room is fully booked',
  };
}
