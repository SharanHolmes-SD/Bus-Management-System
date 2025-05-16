import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    default: uuidv4,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  startLocation: {
    type: String,
    required: true
  },
  endLocation: {
    type: String,
    required: true
  },
  bookingDate: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bus',
    required: true
  },
  seats: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      
    }
  },
  passengerName: {
    type: String,
    required: true
  },

  passengerPhone: {
    type: String,
    required: true
  },

  totalPrice: {
    type: String,
    required: true
  }
});

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;