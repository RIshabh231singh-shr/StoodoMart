const redisClient = require("../config/redis");
const Person = require("../models/person");
const validateUser = require("../Utility/validate")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../Utility/sendEmail");
const sendFlexibleEmail = require("../Utility/mailer");


// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => { if (error) reject(error); else resolve(result); }
        );
        stream.end(buffer);
    });
};

const register = async (req, res) => {
    try {
        // validation check
        const validation = validateUser(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        const { firstname, lastname, email, password, role, college, contactNumber } = req.body;

        // check if the user already exist
        const existingPerson = await Person.findOne({ email });
        if (existingPerson) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); // it means salt is added to the password and then hashed

        let formattedContactNumber = contactNumber;
        if (formattedContactNumber && !formattedContactNumber.startsWith('+91')) {
            formattedContactNumber = '+91' + formattedContactNumber;
        }

        // NOW CREATE THE USER IN DATABSE 

        const savedPerson = await Person.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role,
            college,
            contactNumber: formattedContactNumber
        });

        // NOW GENERATE THE OTP
        // crypto module tumne upar already require kiya hua hai
        const otp = crypto.randomInt(100000, 999999).toString();
        // save the OTP and expiry in the saved person document 
        savedPerson.otp = otp;
        savedPerson.otpExpiry = Date.now() + 5 * 60 * 1000;
        await savedPerson.save();

        await sendEmail(savedPerson.email, otp);

        savedPerson.password = undefined;



        res.status(201).json({
            message: "Person registered successfully! Please check your email for otp",
            person: savedPerson
        });

    } catch (error) {
        console.error("Error while registering person:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // find the user
        const person = await Person.findOne({ email });

        if (!person) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Check otp
        if (person.otp !== otp || person.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // remove otp
        person.isVerified = true;
        person.otp = undefined;
        person.otpExpiry = undefined;
        await person.save();

        const token = jwt.sign(
            { id: person._id, role: person.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // 7 days 
        );

        // add cookies 

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Production mein true karna (https)
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });


        person.password = undefined;

        res.status(200).json({
            message: "Email verified successfully! You can now access StudoMart.",
            person: person
        });

    } catch (error) {
        console.error("Error while verifying OTP:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });

    }
}

const updateprofile = async (req, res) => {
    try {
        const validation = validateUser(req.body, true);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Person ID is required" });
        }

        const loggedInUserId = req.user.id;
        const loggedInUserRole = req.user.role;
        if (loggedInUserRole !== "SuperAdmin" && loggedInUserId !== id) {
            return res.status(403).json({
                message: "You are not allowed to update this user"
            });
        }

        const { firstname, lastname, email, password, role } = req.body;

        const updateData = { firstname, lastname, email };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }

        if (role) {
            updateData.role = role;
        }

        // Handle optional avatar upload
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer, "stoodomart/avatars");
            updateData.avatar = uploadResult.secure_url;
        }

        const updateperson = await Person.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
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
    catch (error) {
        console.error("Error Updating person data :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const deleteprofile = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const loggedInUserRole = req.user.role;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Person ID is required" });
        }
        if (loggedInUserRole !== "SuperAdmin" && loggedInUserId !== id) {
            return res.status(403).json({
                message: "You are not allowed to delete this user"
            });
        }
        const deleteperson = await Person.findByIdAndDelete(id);
        if (!deleteperson) {
            return res.status(404).json({ message: "Person not found" });
        }
        deleteperson.password = undefined;
        res.status(200).json({
            message: "Person deleted successfully",
            person: deleteperson
        })
    }
    catch (error) {
        console.error("Error Deleting person data :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const person = await Person.findOne({ email });
        if (!person) {
            return res.status(404).json({ message: "Person not found" });
        }

        // check if the user is verified 
        if (!person.isVerified) {
            return res.status(401).json({
                message: "Email is not verified. Please verify your OTP first."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, person.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: person._id, role: person.role }, process.env.JWT_SECRET, {
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
    catch (error) {
        console.error("Error Logging in person :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getOneProfile = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Person ID is required" });
        }
        const person = await Person.findById(id);
        if (!person) {
            return res.status(404).json({ message: "Person not found" });
        }
        person.password = undefined;
        res.status(200).json({
            message: "Person profile fetched successfully",
            person: person,
        })
    }
    catch (error) {
        console.error("Error Fetching person profile :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getAllProfile = async (req, res) => {
    try {
        let { page, limit, email } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }

        const person = await Person.find(query).select("-password").skip(skip).limit(limit);
        const totalPersons = await Person.countDocuments(query);
        const totalPages = Math.ceil(totalPersons / limit);

        res.status(200).json({
            message: "Person profile fetched successfully",
            person: person,
            currentPage: page,
            totalPages: totalPages,
            totalPersons: totalPersons
        })
    }
    catch (error) {
        console.error("Error Fetching person profile :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }
        const payload = jwt.decode(token);
        await redisClient.set(`token : ${token}`, "Blocked");
        await redisClient.expireAt(`token : ${token}`, payload.exp);
        res.clearCookie("token");
        res.status(200).json({ message: "Person logged out successfully" });
    }
    catch (error) {
        console.error("Error Logging out person :", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const verifyAuth = async (req, res) => {
    try {
        // userMiddleware already fetched the user and attached it to req.user
        res.status(200).json({
            message: "User verified successfully",
            person: req.user
        });
    } catch (error) {
        console.error("Error verifying person:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const promoteToAdmin = async (req, res) => {
    try {
        const userId = req.user.id;
        const person = await Person.findByIdAndUpdate(
            userId,
            { role: "Admin" },
            { new: true, runValidators: true }
        );

        if (!person) {
            return res.status(404).json({ message: "User not found" });
        }

        // We should also update the JWT token if role change needs to be reflected in token immediately
        // However, for simplicity and since we update local state, let's just return the user
        person.password = undefined;

        res.status(200).json({
            message: "User promoted to Admin successfully",
            person: person
        });
    } catch (error) {
        console.error("Error promoting user to Admin:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const changeCurrentPassword = async (req, res) => {
    try {

        const { oldPassword, newPassword } = req.body

        const user = await Person.findById(req.user._id);
        //  matlab ki find user fromm database

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); // matlab ki check karo ki old password sahi hai ya nahi

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid old password" });
        }

        // FIX 3: Hash the new password before saving it (CRITICAL!)
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save({ validateBeforeSave: false }) // matlab ki save kar do database me

        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error("Password change error:", error);
        return res.status(500).json({ message: error.message || "Internal server error", stack: error.stack });
    }


}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const person = await Person.findOne({ email });
        if (!person) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        person.otp = otp;
        person.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 mins expiry
        await person.save({ validateBeforeSave: false });

        const emailOptions = {
            email: person.email,
            subject: 'StoodoMart Password Reset',
            message: `Your OTP for password reset is ${otp}. It is valid for 15 minutes.`,
            html: `<h3>Password Reset Requested</h3><p>Your OTP for password reset is <strong>${otp}</strong>.</p><p>It is valid for 15 minutes.</p>`
        };

        await sendFlexibleEmail(emailOptions);

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP and new password are required" });
        }

        const person = await Person.findOne({ email });
        if (!person) {
            return res.status(404).json({ message: "User not found" });
        }

        if (person.otp !== otp || person.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        person.password = await bcrypt.hash(newPassword, salt);
        person.otp = undefined;
        person.otpExpiry = undefined;
        await person.save({ validateBeforeSave: false });

        res.status(200).json({ message: "Password reset successfully. You can now login." });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



module.exports = {
    register,
    updateprofile,
    deleteprofile,
    login,
    getOneProfile,
    getAllProfile,
    logout,
    verifyAuth,
    promoteToAdmin,
    verifyOtp,
    changeCurrentPassword,
    forgotPassword,
    resetPassword,

};
