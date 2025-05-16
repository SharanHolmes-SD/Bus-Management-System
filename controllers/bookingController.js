import mongoose from "mongoose";
import User from "../models/userModel.js";
import Bus from "../models/busModel.js";
import Booking from "../models/bookingModel.js";
import { isAdmin, isPassenger } from "./userController.js";

export const createBooking = async (req, res) => {

    if(!isPassenger(req)) {
        return res.status(403).json({
          message: "Please login as a passenger to make bookings"
        });
      }

      const parseDate = (dateStr) => {
        // Handle DD-MM-YYYY format
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
          const [day, month, year] = dateStr.split('-');
          return new Date(`${year}-${month}-${day}`);
        }
        // Handle ISO format (YYYY-MM-DD)
        return new Date(dateStr);
      };

  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { userId, startLocation, endLocation, bookingDate, time, busId, seats, passengerName, passengerPhone,totalPrice } = req.body;

    // Validate required fields
    if (!userId || !startLocation || !endLocation || !bookingDate || !time || !busId || !seats || !passengerName || !passengerPhone || !totalPrice) {
      throw new Error('All fields are required');
    }

    // Validate user exists
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User not found');

    // Validate bus exists
    const bus = await Bus.findById(busId).session(session);
    if (!bus) throw new Error('Bus not found');

    // Validate bus schedule
    const schedule = bus.schedule.find(s => {
        const dbDate = parseDate(s.date);
        const inputDate = parseDate(bookingDate);
        return dbDate.getTime() === inputDate.getTime();
      });
  
      if (!schedule) throw new Error('Bus not available on selected date');
    
    const timeSlot = schedule.times.find(t => t.startTime === time);
    if (!timeSlot) throw new Error('Bus not available at selected time');

    // Validate seat availability
    const existingBookings = await Booking.find({
      busId,
      bookingDate,
      time
    }).session(session);

    const bookedSeats = existingBookings.flatMap(booking => booking.seats);
    const conflictingSeats = seats.filter(seat => bookedSeats.includes(seat));

    if (conflictingSeats.length > 0) {
      throw new Error(`Seats ${conflictingSeats.join(', ')} are already booked`);
    }

    // Validate seat count
    if (seats.length > parseInt(bus.noOfSeats)) {
      throw new Error('Selected seats exceed bus capacity');
    }

    // Create booking
    const newBooking = new Booking({
      userId,
      startLocation,
      endLocation,
      bookingDate,
      time,
      busId,
      seats,
      passengerName,
      passengerPhone,
      totalPrice
    });

    await newBooking.save({ session });

    await session.commitTransaction();
    res.status(201).json(newBooking);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};





export const getBookedSeats = async (req, res) => {
  try {
    const { busId, bookingDate, time } = req.query;
    
    const bookings = await Booking.find({
      busId,
      bookingDate,
      time
    });

    const bookedSeats = bookings.flatMap(booking => booking.seats);
    res.json({ bookedSeats });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




export async function getBookings(req, res) {
  try {
    if (isPassenger(req)) {
      
      const bookings = await Booking.find({ userId: req.user._id });
      res.json(bookings);
      return;
    } else if (isAdmin(req)) {
      const bookings = await Booking.find({});
      res.json(bookings);
      return;
    } else {
      res.json({
        message: "Please login to view bookings"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


export async function deleteBooking(req, res)  {
  try {
    const booking = await Booking.findById(req.params.id);
    
    // Check if within 2 hours
    const departure = new Date(`${booking.bookingDate}T${booking.time}`);
    if ((departure - new Date()) <= 2 * 60 * 60 * 1000) {
      return res.status(400).json({ 
        error: "Cannot cancel within 2 hours of departure" 
      });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookingId } = req.params;
    const { userId } = req.body;

    // Validate booking exists
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Validate user owns the booking
    if (booking.userId.toString() !== userId) {
      throw new Error('Unauthorized to cancel this booking');
    }

    // Calculate time difference
    const bookingDateTime = new Date(`${booking.bookingDate}T${booking.time}`);
    const currentTime = new Date();
    const timeDiffHours = (bookingDateTime - currentTime) / (1000 * 60 * 60);

    // Calculate refund amount based on cancellation time
    let refundAmount = 0;
    let refundMessage = '';

    if (timeDiffHours > 3) {
      // Full refund for cancellations more than 3 hours before departure
      refundAmount = booking.totalPrice;
      refundMessage = 'Full refund will be processed';
    } else if (timeDiffHours > 1) {
      // Half refund for cancellations between 1-3 hours before departure
      refundAmount = booking.totalPrice / 2;
      refundMessage = '50% refund will be processed';
    } else if (timeDiffHours > 0) {
      // No refund for cancellations less than 1 hour before departure
      refundMessage = 'No refund available for cancellations less than 1 hour before departure';
    } else {
      throw new Error('Cannot cancel a booking that has already departed');
    }

    // Delete the booking
    await Booking.findByIdAndDelete(bookingId).session(session);

    await session.commitTransaction();
    res.json({ 
      message: 'Booking cancelled successfully',
      refundMessage,
      refundAmount: refundAmount > 0 ? refundAmount : 0
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};