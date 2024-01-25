const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    languagePreference: {
        type: String,
        default: "english"
    },
    progress: [
        {
            language: String,
            proficiency: {
                easy: {
                    total: Number,
                    solved: Number,
                },
                medium: {
                    total: Number,
                    solved: Number,
                },
                hard: {
                    total: Number,
                    solved: Number,
                },
            },
            score: Number,
            completed: Boolean,
        },
    ],
});

const QuestionsSchema = new Schema({
    question: String,
    options: [String],
    answer: String,
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
    },
    language: String,
});

const User = Model("user", UserSchema);
const Question = Model("question", QuestionsSchema);

module.exports = { User, Question };
