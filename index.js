import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routes/userRouter.js';
import busRouter from './routes/busRoute.js';
import routeRouter from './routes/routeRoute.js';
import driverRouter from './routes/driverRoute.js';
import bookingRouter from './routes/bookingRoute.js';
import staffRouter from './routes/staffRoute.js';
import InventoryRouter from './routes/inventoryRoute.js';




dotenv.config();

const app = express();

const mongoUrl = process.env.MONGO_URI
mongoose.connect(mongoUrl,{})
const connection = mongoose.connection;

connection.once("open",()=>{
    console.log("Database Connected");
})

app.use(cors())

app.use(bodyParser.json())
app.use(
  (req,res,next)=>{

  const token =  (req.header("Authorization"))?.replace("Bearer ", "")
 

  if(token != null){
    jwt.verify(token, process.env.SECRET, (error, decoded)=>{
      if(!error){
        req.user = decoded
      }
    })
  }
  next()
  }
)


app.use("/api/users",userRouter)
app.use("/api/buses",busRouter)
app.use("/api/route",routeRouter)
app.use("/api/drivers",driverRouter)
app.use("/api/bookings",bookingRouter)
app.use("/api/staff",staffRouter)
app.use("/api/inventory",InventoryRouter)





app.listen(
    5000,
    ()=>{
      console.log('Server is running on port 5002');
    }
  )
  