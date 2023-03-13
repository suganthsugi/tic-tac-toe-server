const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

app.use(cors({
    origin: 'https://xo-tic-tac-toe-xo.netlify.app',
    credentials: true
}));

require('./dbconfig');

// importing routes
const gameRoute = require('./Routes/gameRoute');

app.use(express.json());
app.use('/', gameRoute);

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`Server started at http://127.0.0.1:${port}`);
});