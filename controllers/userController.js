import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv  from "dotenv";


dotenv.config()




export function creatAdmin(req,res){

    const newUserData = req.body
    
    
    if(newUserData.type == "admin"){
    
        if(req.user==null){
            res.json({
                message: "You are not loged in. plese log in as an admin to create admin account"
            })
            return
        }
    
        if(req.user.type !="admin"){
            res.json({
                message: "You are not an admin. plese log in as an admin"
            })
        }
    }
    
    
    
    newUserData.password = bcrypt.hashSync(newUserData.password, 10)
    
    
    const user  = new User(newUserData)
    
    user.save().then(()=>{
        res.json({
            message: "User created"
        })
    }).catch(()=>{
        res.json({
            message: "User not created"
        })
    })
    
    }




    export function loginUser(req,res){

        User.find({email: req.body.email}).then(
            (users)=>{
                if(users.length == 0){
                    res.json({
                        message: "User not found"
                    })
                }else {
    
                    const user = users[0]
    
                   const isPasswordCorrect =  bcrypt.compareSync(req.body.password, user.password)
    
                   if(isPasswordCorrect){
                    const token = jwt.sign({
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        type: user.type,
                        profilepic: user.profilepic,
                        _id: user._id 
                    }, process.env.SECRET)
                        res.json({
                            message: "Logged in successful",
                            token: token,
                            user: {
                                _id: user._id,
                                firstName : user.firstName,
                                lastName : user.lastName,
                                email: user.email,
                                profilepic: user.profilepic,
                                type : user.type
                            }
                        })
    
                   }else{
                    res.json({
                        message: "Your Password Is not correct"
                    })
                   }
                }
            }
        )
    }


    export async function getAllUsers(req, res) {
        try {
            const user = await User.find({}, '-password');
            res.json(user);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ message: "Error fetching users" });
        }
    }


    export function createCustomer(req, res) {
        const newUserData = req.body;
    
        User.findOne({ email: newUserData.email })
            .then(existingUser => {
                if (existingUser) {
                    return res.status(400).json({ message: "A user with this email already exists." });
                }
    
                newUserData.password = bcrypt.hashSync(newUserData.password, 10);
    
                const user = new User(newUserData);
    
                user.save()
                    .then(() => {
                        res.status(201).json({ message: "Registration successful" });
                    })
                    .catch(err => {
                        console.error("Error creating user:", err);
                        res.status(500).json({ message: "Customer user not created", error: err });
                    });
            })
            .catch(err => {
                console.error("Error checking email:", err);
                res.status(500).json({ message: "Error occurred while checking email", error: err });
            });
    }






export function isAdmin(req){

    if(req.user==null){
        return false
    }

    if(req.user.type != "admin"){
        return false
    }

    return true
}

export function isPassenger(req){

    if(req.user==null){
        return false
    }

    if(req.user.type != "passenger"){
        return false
    }

    return true
}

export async function getUser(req,res){
    if(req.user==null){
        res.status(404).json({
            message: "Please login to view user detaile"
        })
        return
    }
    res.json(req.user)
}

export async function deleteUser(req, res) {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                message: "Please login as an admin to delete users!"
            });
        }

        const userId = req.params.userId;
        
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error });
    }
}