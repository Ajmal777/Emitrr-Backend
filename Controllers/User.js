const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const APIError = require("../util/APIError");
const { User } = require("../Models");

const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// joi will validate user details based on this object
const validateObj = {
    email: joi.string().email().required(),
    password: joi.string().min(5).required(),
};

const controllers = {};

controllers.registerUser = async (name, email, password) => {
    // validate user input
    const { error } = joi
        .object({
            name: joi.string().min(1).max(20).required(),
            ...validateObj,
        })
        .validate({ name, email, password });

    if (error) {
        throw new APIError(error.message, 400);
    }

    // check whether the email has already been registered or not
    const check = await User.findOne({ email });

    if (check) {
        throw new APIError("Conflict: Email already exists", 409);
    }

    // Encrypt user password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

    const userObj = new User({
        name,
        email,
        password: hashedPassword,
    });

    // Save the user data into the database
    await userObj.save();
    return {
        status: 201,
        message: "Registration successful",
    };
};

controllers.loginUser = async (email, password) => {
    // Validate user input
    const { error } = joi.object(validateObj).validate({ email, password });

    if (error) {
        throw new APIError(error.message, 400);
    }

    // check whether the user exists or not
    const userData = await User.findOne({ email });

    if (!userData) {
        throw new APIError("User not found", 404);
    }

    // check whether the password matches
    const check = await bcrypt.compare(password, userData.password);

    if (!check) {
        throw new APIError("Incorrect password", 401);
    }

    const payload = {
        userId: userData._id,
        name: userData.name,
        email,
    };

    // Generates a jwt token for authentication
    const token = jwt.sign(payload, JWT_SECRET_KEY);

    return {
        status: 200,
        message: "Login successful",
        data: {
            token,
            user: payload,
        },
    };
};

module.exports = controllers;
