const languages = require("../Data");
const { Question } = require("../Models");

const controllers = {};

controllers.getLanguageList = async () => {
    const data = (Object.keys(languages));
    return {
        status: 200,
        message: 'List of languages fetched successfully.',
        data: data,
    }
}

controllers.getQuestionByLanguage = async (
    language,
    difficulty,
    page = 1,
    perPage = 10
) => {
    page = Number(page);
    perPage = Number(perPage);

    const query = {};

    if (language) {
        query.language = language;
    }
    if (difficulty) {
        query.difficulty = difficulty;
    }
    const questions = await Question.find(query)
        .skip(perPage * (page - 1))
        .limit(perPage);
    return {
        status: 200,
        message: "Questions fetched",
        data: questions,
    };
};

module.exports = controllers;