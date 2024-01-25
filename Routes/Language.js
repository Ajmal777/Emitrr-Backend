const {
    getLanguageList,
    getQuestionByLanguage,
} = require("../Controllers/Language");
const Auth = require("../middlewares/auth");
const asyncHandler = require("../middlewares/asyncHandler");

const router = require("express").Router();

router.use(Auth);

// Fetches the list of available langugages
router.get(
    "/",
    asyncHandler((req, res) => {
        return getLanguageList();
    })
);

router.get(
    "/:language",
    asyncHandler((req, res) => {
        const { language } = req.params;
        const { difficulty, page, perPage } = req.query;
        return getQuestionByLanguage(language, difficulty, page, perPage);
    })
);

module.exports = router;
