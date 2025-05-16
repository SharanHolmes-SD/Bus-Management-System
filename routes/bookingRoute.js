import express from "express";
import { createBooking, deleteBooking, getBookedSeats, getBookings, cancelBooking } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookedSeats);
bookingRouter.get("/getbookings", getBookings);
bookingRouter.delete("/:bookingId", cancelBooking);

export default bookingRouter;