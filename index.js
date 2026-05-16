require('dotenv').config();
// const logger = require('./logger');


const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

const routes = require('./routes');
const PORT = process.env.API_PORT;

app.get('/', (req, res) => {
    res.send({message: 'Hello world!', status: 200});
});

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`);
});