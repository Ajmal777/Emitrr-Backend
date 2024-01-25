const englishQuestions = require('./English');
const hindiQuestions = require('./Hindi');
const frenchQuestions = require('./French');

const languages = {};
languages.english = englishQuestions;
languages.hindi = hindiQuestions;
languages.french = frenchQuestions;

module.exports = languages;