const {
    getAllQuestions,
    createNewQuestion,
    getQuestionById,
    evaluateAndUpdate,
    getQuestionByLanguage,
    getLanguageList,
} = require("../Controllers");

const Auth = require("../middlewares/Auth");
const asyncHandler = require("../middlewares/asyncHandler");

const router = require("express").Router();

router.use(Auth);

// Fetch all questions
router.get(
    "/",
    asyncHandler((req, res) => {
        return getAllQuestions();
    })
);

// Fetch question by ID
router.get(
    "/:id",
    asyncHandler((req, res) => {
        const { id } = req.params;
        return getQuestionById(id);
    })
);

// Create a new question
router.post(
    "/",
    asyncHandler((req, res) => {
        const { data, language, difficulty } = req.body;
        return createNewQuestion(data, language, difficulty);
    })
);

// Evaluate user results
router.post(
    "/eval",
    asyncHandler((req, res) => {
        const { userId } = req.locals;
        const { data } = req.body;
        return evaluateAndUpdate(userId, data);
    })
)

module.exports = router;