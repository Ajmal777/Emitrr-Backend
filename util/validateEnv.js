const APIError = require("./APIError");

const REQUIRED_ENV_VARIABLES = [
    "PORT",
    "MONGODB_URI",
    "JWT_SECRET_KEY",
    "BCRYPT_SALT",
];

const validateEnv = () => {
    const notSetEnv = REQUIRED_ENV_VARIABLES.filter(
        (env) => process.env[env] == undefined
    );
    if (notSetEnv.length > 0) {
        throw new APIError(
            `Required ENV variables are not set: [${notSetEnv.join(", ")}]`
        );
    }
};

module.exports = validateEnv;
