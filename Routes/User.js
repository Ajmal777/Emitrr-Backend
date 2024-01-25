const { registerUser, loginUser, getUserData } = require('../Controllers');
const asyncHandler = require('../middlewares/asyncHandler');

const router = require('express').Router();

router.post('/register', asyncHandler((req, res) => {
    const { name, email, password } = req.body;
    return registerUser(name, email, password);
}))

router.post('/login', asyncHandler((req, res) => {
    const { email, password } = req.body;
    return loginUser(email, password);
}))

module.exports = router;