const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    firstname: {
        type : String,
        required : true,
        trim : true,
        minLength : 3,
        maxLength : 100,
    },
    lastname: {
        type : String,
        trim : true,
        minLength : 3,
        maxLength : 100,
    },
    email: {
        type : String,
        required : true,
        trim : true,
        unique : true,
    },
    password: {
        type : String,
        required : true,
        minLength : 6,
    },
    role: {
        type : String,
        required : true,
        enum : ["User", "Admin","SuperAdmin"],
        default : "User",
    },
},{timestamps:true});


const Person = mongoose.model("Person", personSchema);
module.exports = Person;
