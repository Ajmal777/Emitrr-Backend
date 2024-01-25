require('dotenv').config();
require('./util/database');
const express = require('express');
const cors = require('cors');
const routes = require('./Routes');
const error = require('./middlewares/error');
const validateEnv = require('./util/validateEnv');
const initializeDatabase = require('./util/initializeDatabase');

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }))

validateEnv();
initializeDatabase();

app.use('/quizApp', routes)

// Handles all request to non existing routes
app.get('*', (req, res) => {
    res.status(404).json({ status: 404, message: 'Page not found.'});
})

// Error handler middleware
app.use(error);

app.listen(process.env.PORT, () => console.log('Server started'))



/*
- Login, Register and Authentication // done
- Fetch questions. // done
- Evaluate answers. // done
- database to store user's language prof levels, progress and exercise data. // done
- manage user data. // done
- language selection to learn.
- language specific exercises. 
- scoring and progress tracking. // done
- track completed exercises // done
- leaderboard
- leaderboard based on language // done
- ask questions based on user performance. // not doing
- view progress and update language preference in profile. // done
- reset progress. // done
*/