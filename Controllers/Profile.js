const Joi = require("joi");
const { User } = require("../Models");
const APIError = require("../util/APIError");
const bcrypt = require('bcrypt');

const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);
const controllers = {};

controllers.getUserData = async (userId) => {
    const data = await User.findById(userId, {password: 0});
    return {
        status: 200,
        message: 'Fetched user data',
        data,
    }
}

controllers.updateProfile = async (userId, body) => {
    const { name, email, oldPassword, newPassword, preferredLanguage } = body;
    const updateObj = {};
    
    if(name){
        updateObj.name = name;
    }

    if(email){
        const check = await User.findOne({email});
        if(check){
            throw new APIError("Conflict: Email already exists", 409);
        }
        updateObj.email = email;
    }

    if(preferredLanguage){
        updateObj.languagePreference = preferredLanguage;
    }

    if(newPassword){
        if (!oldPassword) {
            throw new APIError("Current password is required", 400);
        }
        if (oldPassword === newPassword) {
            throw new APIError("New password is same as current password", 422);
        }

        const userObj = await User.findById(userId);
        const checkPassword = await bcrypt.compare(
            oldPassword,
            userObj.password
        );

        if (!checkPassword) {
            throw new APIError("Incorrect current password", 400);
        }
        const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT);
        updateObj.password = hashedPassword;
    }
    if(Object.keys(updateObj).length === 0){
        return {
            status: 200,
            message: "Nothing was updated"
        }
    }
    const data = await User.findByIdAndUpdate(userId, updateObj, {projection: {password: 0}});
    return {
        status: 200,
        message: 'Profile updated successfully.',
        data,
    }
}

controllers.setPreferredLanguage = async (userId, language) => {
    const { error } = Joi.string().validate(language);

    if (error) {
        throw new APIError(error.message, 400);
    }

    const res = await User.findByIdAndUpdate(userId, {
        $set: { languagePreference: language },
    });

    return {
        status: 200,
        message: "Language preference updated successfully.",
    };
};

controllers.resetProgress = async (userId) => {
    await User.findByIdAndUpdate(userId, { progress: [] });
    return {
        status: 200,
        message: "Progress reset successfully.",
    };
};

controllers.leaderboard = async (language) => {
    const data = await User.aggregate([
        { $match: { "progress.language": language } },
        { $project: {name: 1, "progress.language": 1, "progress.score": 1}},
        { $sort: {"progress.score": -1}}
    ]);

    return {
        status: 200,
        message: 'Fetched leaderboard successfully',
        data: data,
    }
};

module.exports = controllers;
