const Joi = require("joi");
const { Question, User } = require("../Models");
const APIError = require("../util/APIError");

const controllers = {};

controllers.getAllQuestions = async () => {
    const data = await Question.find();
    return {
        status: 200,
        message: "Successfully retrieved all questions.",
        data: data,
    };
};

controllers.getQuestionById = async (id) => {
    const data = await Question.findById(id);
    if (!data) {
        throw new APIError(
            "Not found: Question with the provided ID not found.",
            404
        );
    }
    
    return {
        status: 200,
        message: "Successfully retrieved question by ID.",
        data: data,
    };
};

controllers.createNewQuestion = async (body, language, difficulty) => {
    const { question, options, answer } = body;
    console.log(body, language, difficulty);
    const { error } = Joi.object({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).min(2),
        answer: Joi.string().required(),
        difficulty: Joi.string().valid("easy", "medium", "hard").required(),
        language: Joi.string().required(),
    }).validate({ ...body, language, difficulty });

    if (error) {
        throw new APIError(error.message, 400);
    }

    const questionObj = new Question({
        question,
        answer,
        options,
        difficulty,
        language: language.toLowerCase(),
    });

    const data = await questionObj.save();

    return {
        status: 201,
        message: "Successfully created a new question.",
        data: data,
    };
};

controllers.evaluateAndUpdate = async (userId, resObj) => {
    const { language, responseList } = resObj;

    // extract and store only the question ids in an array
    let questionIdList = Object.keys(responseList);

    const questionsList = await Question.find({
        _id: { $in: questionIdList },
    });

    // Stores count of questions solved by user of different difficulty levels
    const solvedCount = {
        easy: 0,
        medium: 0,
        hard: 0,
    };
    // Stores count of total questions of all difficulty levels
    const totalCount = {
        easy: 0,
        medium: 0,
        hard: 0,
    };

    for (const question of questionsList) {
        const { _id, difficulty, answer } = question;

        const userAnswer = responseList[_id];
        totalCount[difficulty]++;

        if (userAnswer === answer) {
            solvedCount[difficulty]++;
        }
    }

    /*
        Easy: 1 point,
        Medium: 3 points,
        Hard: 5 points 
    */
    const userScore =
        solvedCount.easy + solvedCount.medium * 3 + solvedCount.hard * 5;
    const totalScore =
        totalCount.easy + totalCount.medium * 3 + totalCount.hard * 5;

    // the exercise will be marked completed if the user
    // correctly answers more than 70% of total questions of the exercise
    const completedExercise = userScore >= totalScore * 0.7;

    const check = await User.findOne({
        _id: userId,
        "progress.language": language,
    });
    if (!check) {
        const progressObj = {
            language,
            proficiency: {
                easy: {
                    total: totalCount.easy,
                    solved: solvedCount.easy,
                },
                medium: {
                    total: totalCount.medium,
                    solved: solvedCount.medium,
                },
                hard: {
                    total: totalCount.hard,
                    solved: solvedCount.hard,
                },
            },
            score: userScore,
            completed: completedExercise,
        };
        const res = await User.findByIdAndUpdate(userId, {
            $push: { progress: progressObj },
        });
    } else {
        const res = await User.updateOne(
            { _id: userId, "progress.language": language },
            {
                $set: {
                    "progress.$[elem].proficiency.easy": {
                        solved: solvedCount.easy,
                        total: totalCount.easy,
                    },
                    "progress.$[elem].proficiency.medium": {
                        solved: solvedCount.medium,
                        total: totalCount.medium,
                    },
                    "progress.$[elem].proficiency.hard": {
                        solved: solvedCount.hard,
                        total: totalCount.hard,
                    },
                    "progress.$[elem].score": userScore,
                    "progress.$[elem].completed": completedExercise,
                },
            },
            {
                arrayFilters: [{ "elem.language": language }],
            }
        );
    }

    return {
        status: 200,
        message: "Evaluation completed",
        data: {
            score: userScore,
            totalScore,
            completedExercise,
        }
    };
};

controllers.test = async (userId) => {
    await User.updateOne({ _id: userId });
};

module.exports = controllers;
