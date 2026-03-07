const redisClient = require("../config/redis");
const jwt = require("jsonwebtoken");
const Person = require("../models/person");

const SuperMiddleware = async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }

        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const payload = jwt.verify(token,process.env.JWT_SECRET);

        const {id} =payload;
        if(payload.role !== "SuperAdmin"){
            return res.status(401).json({message:"Unauthorized"});
        }
        const person = await Person.findById(id).select("-password");
        if(!person){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.user = person;
        next();
    }
    catch(error){
        console.error("Error in SuperAdminmiddleware:",error);
        res.status(500).json({message:"Internal server error"});
    }
}
module.exports = SuperMiddleware;