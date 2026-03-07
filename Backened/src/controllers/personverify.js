const redisClient = require("../config/redis");
const Person = require("../models/person");
const validateUser = require("../Utility/validate")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const validation = validateUser(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        const { firstname, lastname, email, password, role } = req.body;

        const existingPerson = await Person.findOne({ email });
        if (existingPerson) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newPerson = await Person.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role
        });
        newPerson.password = undefined;

        const token = jwt.sign({ id: newPerson._id,role:newPerson.role }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000
        });

        res.status(201).json({
            message: "Person registered successfully",
            person: newPerson,
        });

    } catch (error) {
        console.error("Error registering person:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const updateprofile = async (req,res)=>{
    try{
        const validation = validateUser(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        //const { id } = req.params;
        const id = req.user.id;
        if(!id){
            return res.status(400).json({ message: "Person ID is required" });
        }
        const { firstname, lastname, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const updateperson = await Person.findByIdAndUpdate(
            id,
            {firstname,lastname,email,password:hashedPassword},
            {new:true,runValidators: true}
        )
        if (!updateperson) {
            return res.status(404).json({ message: "Person not found" });
        }
        updateperson.password = undefined;

        res.status(200).json({
            message: "Person updated successfully",
            person: updateperson
        })
    }
    catch(error){
        console.error("Error Updating person data :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const deleteprofile = async (req,res)=>{
    try{
        const loggedInUserId = req.user.id;
        const loggedInUserRole = req.user.role;
        const { id } = req.params;
         if(!id){
            return res.status(400).json({ message: "Person ID is required" });
        }
        if (loggedInUserRole !== "SuperAdmin" && loggedInUserId !== id) {
            return res.status(403).json({
                message: "You are not allowed to delete this user"
            });
        }
        const deleteperson = await Person.findByIdAndDelete(id);
        if(!deleteperson){
            return res.status(404).json({ message: "Person not found" });
        }
        deleteperson.password = undefined;
        res.status(200).json({
            message: "Person deleted successfully",
            person: deleteperson
        })
    }
    catch(error){
        console.error("Error Deleting person data :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const login = async (req,res)=>{
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const person = await Person.findOne({ email });
        if (!person) {
            return res.status(404).json({ message: "Person not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, person.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: person._id ,role: person.role}, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
        person.password = undefined;
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Person logged in successfully",
            person: person,
        })
    }
    catch(error){
        console.error("Error Logging in person :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getOneProfile = async (req,res)=>{
    try{
        const { id } = req.params;
        if(!id){
            return res.status(400).json({ message: "Person ID is required" });
        }
        const person = await Person.findById(id);
        if(!person){
            return res.status(404).json({ message: "Person not found" });
        }
        person.password = undefined;
        res.status(200).json({
            message: "Person profile fetched successfully",
            person: person,
        })
    }
    catch(error){
        console.error("Error Fetching person profile :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getAllProfile = async (req,res)=>{
    try{
        const person = await Person.find().select("-password");
        if(person.length === 0){
            return res.status(404).json({ message: "Person not found" });
        }

        res.status(200).json({
            message: "Person profile fetched successfully",
            person: person,
        })
    }
    catch(error){
        console.error("Error Fetching person profile :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const logout = async (req,res)=>{
    try{
        const { token } = req.cookies;
        if(!token){
            return res.status(400).json({ message: "Token is required" });
        }
        const payload = jwt.decode(token);
        await redisClient.set(`token : ${token}`,"Blocked");
        await redisClient.expireAt(`token : ${token}`,payload.exp);
        res.clearCookie("token");
        res.status(200).json({ message: "Person logged out successfully" });
    }
    catch(error){
        console.error("Error Logging out person :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = {
    register , updateprofile , deleteprofile , login , getOneProfile , getAllProfile , logout
};
