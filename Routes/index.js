const router = require('express').Router();

const UserRoutes = require('./User');
const QuestionRoutes = require('./Question');
const ProfileRoutes = require('./Profile');
const LanguageRoutes = require('./Language');

// Merges all routes into one object
router.use('/user', UserRoutes);
router.use('/question', QuestionRoutes);
router.use('/profile', ProfileRoutes);
router.use('/language', LanguageRoutes);

module.exports = router;