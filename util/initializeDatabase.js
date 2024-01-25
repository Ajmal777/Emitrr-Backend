const questionsList = require("../Data")
const { Question } = require("../Models")

const initializeDatabase = async () => {
    const languages =  Object.keys(questionsList);        
    const difficultyLevels = ['easy', 'medium', 'hard'];
    const newQuestionsList = [];
    for(const language of languages){
        const check = await Question.find({ language });
        if(check.length > 0) continue;

        for(const level of difficultyLevels){
            const data = questionsList[language][level];
            const newData = data.map(val => {
                val.difficulty = level;
                val.language = language;
                return val;
            })
            newQuestionsList.push(...newData);
        }
    }
    await Question.create(newQuestionsList);

    return {
        status: 200,
        message: 'Database initialized with questions'
    }
}

module.exports = initializeDatabase;