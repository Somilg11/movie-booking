import mongoose from 'mongoose';
import { BookingModel } from './booking.model.js';
import { ShowModel } from '../shows/show.model.js';
import { AppError } from '../../common/utils/AppError.js';
import { BookingStatus } from './booking.types.js';
import { logger } from '../../common/utils/logger.js';

export class BookingService {
    async createBooking(userId: string, showId: string, seatNumbers: string[]) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Get Show and lock for update (optimistic concurrency can also work, but locking guarantees seat check)
            // Mongoose doesn't support pessimistic locking easily without raw queries or findOneAndUpdate
            // We will use atomic update on 'availableSeats' and check if seats are free.

            // For specific seat locking (A1, A2), we need to check if those specific seats are booked.
            // Assuming Show model tracks booked seats or we query all bookings for this show.

            // Check for existing bookings for these seats
            const existingBookings = await BookingModel.findOne({
                // @ts-ignore
                show: new mongoose.Types.ObjectId(showId),
            }).session(session);

            // Better approach with ShowID:
            const show = await ShowModel.findById(showId).session(session);
            if (!show) {
                throw new AppError('Show not found', 404);
            }

            // Check if seats are already booked
            // We need to query Bookings by Show parameters to find occupied seats
            const bookedBookings = await BookingModel.find({
                movieId: show.movieId,
                theatreId: show.theatreId,
                showTime: show.startTime,
                status: { $in: [BookingStatus.CONFIRMED, BookingStatus.CREATED] } // Exclude Cancelled
            }).session(session);

            const occupiedSeats = new Set();
            bookedBookings.forEach(b => b.seats.forEach(s => occupiedSeats.add(s)));

            for (const seat of seatNumbers) {
                if (occupiedSeats.has(seat)) {
                    throw new AppError(`Seat ${seat} is already booked`, 409);
                }
            }

            // Check capacity
            if (show.availableSeats < seatNumbers.length) {
                throw new AppError('Not enough seats available', 400);
            }

            // 2. Create Booking
            const booking = await BookingModel.create([{
                userId,
                theatreId: show.theatreId,
                movieId: show.movieId,
                showTime: show.startTime,
                seats: seatNumbers,
                status: BookingStatus.CREATED, // Pending payment
                totalAmount: show.price * seatNumbers.length,
                currency: 'USD'
            }], { session });

            // 3. Update Show seats (Reserve them)
            // Decrement available seats. 
            // Ideally we should track *which* seats in Show model to avoid race conditions better, 
            // but 'availableSeats' count + unique Booking check above covers it for now.

            show.availableSeats -= seatNumbers.length;
            await show.save({ session });

            await session.commitTransaction();
            return booking[0];

        } catch (error) {
            await session.abortTransaction();
            logger.error({ err: error }, 'Booking creation failed');
            throw error;
        } finally {
            session.endSession();
        }
    }

    async cancelBooking(bookingId: string, userId: string, isAdmin = false) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const booking = await BookingModel.findById(bookingId).session(session);
            if (!booking) throw new AppError('Booking not found', 404);

            if (!isAdmin && booking.userId.toString() !== userId) {
                throw new AppError('Not authorized to cancel this booking', 403);
            }

            if (booking.status === BookingStatus.CANCELLED) {
                throw new AppError('Booking already cancelled', 400);
            }

            booking.status = BookingStatus.CANCELLED;
            booking.cancelledAt = new Date();
            await booking.save({ session });

            // Restore seats in Show
            // Find show by fields (since Booking doesn't have showId directly yet, strict matching)
            const show = await ShowModel.findOne({
                movieId: booking.movieId,
                theatreId: booking.theatreId,
                startTime: booking.showTime
            }).session(session);

            if (show) {
                show.availableSeats += booking.seats.length;
                await show.save({ session });
            }

            await session.commitTransaction();
            return booking;

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async listBookings(userId: string, role: string) {
        // Admin sees all? Or just System Admin. 
        // Logic: Customer sees own. Client sees bookings for their theatres?

        let query = {};
        if (role === 'CUSTOMER') {
            query = { userId };
        }
        // For Client/Admin we might need different filters. Keeping simple for now.

        return BookingModel.find(query).sort({ createdAt: -1 });
    }
}

export const bookingService = new BookingService();
