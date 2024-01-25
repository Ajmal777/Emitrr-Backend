const {
    setPreferredLanguage,
    resetProgress,
    updateProfile,
    leaderboard,
    getUserData,
} = require("../Controllers");
const Auth = require("../middlewares/Auth");
const asyncHandler = require("../middlewares/asyncHandler");

const router = require("express").Router();

router.use(Auth);

router.get('/',
    asyncHandler((req, res) => {
        const { userId } = req.locals;
        return getUserData(userId);
    })
)

router.put(
    "/",
    asyncHandler((req, res) => {
        const { userId } = req.locals;
        return updateProfile(userId, req.body);
    })
);

router.put(
    "/language",
    asyncHandler((req, res) => {
        const { userId } = req.locals;
        const { preferredLanguage } = req.query;
        return setPreferredLanguage(userId, preferredLanguage);
    })
);

router.delete(
    "/",
    asyncHandler((req, res) => {
        const { userId } = req.locals;
        return resetProgress(userId);
    })
);

router.get(
    '/leaderboard/:language', 
    asyncHandler((req, res) => {
        const { language } = req.params;
        return leaderboard(language);
    })
)

module.exports = router;
