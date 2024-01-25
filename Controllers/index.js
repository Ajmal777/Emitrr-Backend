// gather all routes and export them in one object


const UserControllers = require('./User');
const QuestionControllers = require('./Question');
const ProfileControllers = require('./Profile');

module.exports = {
    ...UserControllers,
    ...QuestionControllers,
    ...ProfileControllers,
};
