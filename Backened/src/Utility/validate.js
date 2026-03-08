const validator = require("validator");

const validateUser = (data, isUpdate = false) => {

    if (!data.firstname)
        return { isValid: false, message: "Firstname is required" };

    if (!data.email)
        return { isValid: false, message: "Email is required" };

    if (!validator.isEmail(data.email))
        return { isValid: false, message: "Invalid email" };

    if (!isUpdate || data.password) {
        if (!data.password)
            return { isValid: false, message: "Password is required" };

        if (!validator.isLength(data.password, { min: 6 }))
            return { isValid: false, message: "Password must be at least 6 characters" };
    }

    if (!isUpdate || data.role) {
        if (!data.role)
            return { isValid: false, message: "Role is required" };

        if (!validator.isIn(data.role, ["User", "Admin", "SuperAdmin"]))
            return { isValid: false, message: "Invalid role" };
    }

    return { isValid: true };
};

module.exports = validateUser;